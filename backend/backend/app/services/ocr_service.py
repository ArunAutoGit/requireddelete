import boto3
import logging
from botocore.exceptions import ClientError, BotoCoreError
from app.core.config import settings  # Import your settings

# Configure logging
logger = logging.getLogger(__name__)

def get_textract_client():
    """Initialize and return a Textract client using config credentials."""
    return boto3.client(
        'textract',
        region_name=settings.AWS_DEFAULT_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Uses AWS Textract to extract text from an image.
    Args:
        image_bytes (bytes): The image file as a bytes object.
    Returns:
        str: All extracted text concatenated into a single string.
    Raises:
        Exception: Propagates any AWS or processing errors.
    """
    try:
        textract_client = get_textract_client()
        
        # Call Amazon Textract
        response = textract_client.detect_document_text(
            Document={'Bytes': image_bytes}
        )
        
        logger.info("Textract API call successful")
        
        # Extract text from the response
        extracted_text = ""
        for item in response["Blocks"]:
            if item["BlockType"] == "LINE":
                extracted_text += item["Text"] + "\n"
                
        logger.debug(f"Extracted text: {extracted_text}")
        return extracted_text.strip()

    except (BotoCoreError, ClientError) as error:
        logger.error(f"AWS Error during Textract processing: {error}")
        raise Exception(f"AWS service error: {error}")
    except Exception as error:
        logger.error(f"Unexpected error during Textract processing: {error}")
        raise Exception(f"Failed to process image: {error}")