import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def evaluate_parameters(age, parameters_dict):
    """
    Evaluates a dictionary of medical parameters and returns a structured JSON response
    with statuses and remarks.
    Returns format:
    {
        "param_name": {"status": "Good" | "Warning" | "Critical", "remarks": "...", "suggestions": "..."}
    }
    """
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key or api_key == "YOUR_KEY" or api_key == "your_openai_api_key_here":
        # Mock response if no key is provided for testing
        print("Warning: No OPENAI_API_KEY found. Generating mock response.")
        mock_results = {}
        for k, v in parameters_dict.items():
            try:
                # simple mock logic just for visualization
                num_val = float(str(v).replace('%', '').strip())
                status = "Warning" if num_val > 100 or num_val < 10 else "Good"
            except:
                status = "Good"
            mock_results[k] = {
                "status": status, 
                "remarks": "Mock evaluation (No API Key)",
                "suggestions": "Mock suggestion: improve lifestyle and consult a physician." if status != "Good" else ""
            }
        return mock_results
        
    client = OpenAI(api_key=api_key)
    prompt = f"""
You are a medical lab report analyzer system.
The patient is {age} years old.
Here are their test parameters:
{json.dumps(parameters_dict, indent=2)}

For each parameter, evaluate if it is within a normal, healthy range.
Respond with a JSON object where the keys are the parameter names and the values are objects containing:
- "status": String, must be exactly "Good", "Warning", or "Critical".
- "remarks": A short string explaining why.
- "suggestions": Actionable steps or recommendations to improve or manage this metric (leave empty if Good).

Only output valid JSON, nothing else. Do not wrap in ```json block.
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that outputs ONLY raw JSON without markdown formatting."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        return json.loads(content)
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return {k: {"status": "Warning", "remarks": f"Error analyzing: {str(e)}"} for k in parameters_dict.keys()}
