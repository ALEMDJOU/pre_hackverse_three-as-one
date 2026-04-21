from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from dependencies import get_current_user
from models.user import User
import urllib.request
import json
import os

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    prompt: str

@router.post("/chat")
async def chat_with_ai(req: ChatRequest, current_user: User = Depends(get_current_user)):
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        raise HTTPException(status_code=500, detail="La clé GROQ_API_KEY n'est pas configurée.")
    
    clean_key = groq_key.replace('"', '').replace("'", "").strip()
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {clean_key}",
        "Content-Type": "application/json",
        "User-Agent": "Sparktime/1.0"
    }
    
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "Tu es un coach d'organisation francophone motivant, qui aide chronométriquement les étudiants à gérer leur emploi du temps. Tu dois toujours être extrêmement bref et aller à l'essentiel (3 phrases maximum)."},
            {"role": "user", "content": req.prompt}
        ]
    }
    
    try:
        req_json = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(url, data=req_json, headers=headers, method="POST")
        
        with urllib.request.urlopen(request, timeout=30.0) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            try:
                reply = res_data["choices"][0]["message"]["content"]
            except (KeyError, IndexError):
                reply = "Désolé, je n'ai pas pu générer de réponse via Groq."
            return {"reply": reply}
            
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        raise HTTPException(status_code=e.code, detail=f"Erreur API LLM: {error_msg}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne lors de la requête de l'IA: {str(e)}")
