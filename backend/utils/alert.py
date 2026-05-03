from twilio.rest import Client
from config import (
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE,
    ALERT_PHONE
)

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_alert(weapon, crime, severity):
    message = f"""
🚨 CCTV ALERT 🚨

Weapon: {weapon}
Crime: {crime}
Severity: {severity}

Immediate attention required!
"""

    try:
        msg = client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=ALERT_PHONE
        )
        return msg.sid
    except Exception as e:
        print("SMS Error:", e)
        return None