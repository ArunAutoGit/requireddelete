import qrcode
from io import BytesIO
import base64
from PIL import Image, ImageDraw, ImageFont
import os
from typing import Optional
from app.core.config import settings
class QRCodeService:
    
    def __init__(self):
        self.base_url = settings.QR_REDEEM_URL
    
    def generate_qr_image(self, data: str, size: int = 300) -> BytesIO:
        """Generate QR code image from data"""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        img = img.resize((size, size))
        
        # Convert to bytes
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return img_buffer
    
    def generate_qr_with_text(self, qr_data: str, text: str, size: int = 400) -> BytesIO:
        """Generate QR code with text below it"""
        # Generate QR code
        qr_buffer = self.generate_qr_image(qr_data, 300)
        qr_image = Image.open(qr_buffer)
        
        # Create a larger image to accommodate text
        total_height = size + 50  # Extra space for text
        combined_image = Image.new('RGB', (size, total_height), 'white')
        
        # Paste QR code
        qr_position = ((size - 300) // 2, 10)
        combined_image.paste(qr_image, qr_position)
        
        # Add text
        try:
            draw = ImageDraw.Draw(combined_image)
            font = ImageFont.load_default()
            # Try to use a better font if available
            try:
                font = ImageFont.truetype("arial.ttf", 20)
            except:
                pass
            
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_position = ((size - text_width) // 2, size + 15)
            
            draw.text(text_position, text, fill="black", font=font)
        except:
            # Fallback if text rendering fails
            pass
        
        # Convert to bytes
        final_buffer = BytesIO()
        combined_image.save(final_buffer, format='PNG')
        final_buffer.seek(0)
        
        return final_buffer
    
    def qr_image_to_base64(self, image_buffer: BytesIO) -> str:
        """Convert image buffer to base64 string"""
        return base64.b64encode(image_buffer.getvalue()).decode('utf-8')
    
    def generate_redeem_url(self, encrypted_token: str) -> str:
        """Generate redeem URL for QR code - ONLY the token part"""
        # Return just the token, not the full URL
        return encrypted_token
