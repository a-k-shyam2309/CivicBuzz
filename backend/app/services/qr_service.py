"""
CivicBuzz QR Code Service
Generates verifiable public audit trail QR codes for resolved complaints and tenders.
"""

import io
import os
import qrcode
from app.core.config import settings


def generate_qr_code_image(data_url: str, output_filename: str) -> str:
    """
    Generates a high-quality QR code PNG for public transparency verification.
    Returns relative URL path to the saved QR image.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(data_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF")

    uploads_dir = settings.UPLOAD_DIR
    os.makedirs(uploads_dir, exist_ok=True)

    file_path = os.path.join(uploads_dir, output_filename)
    img.save(file_path)

    return f"/uploads/{output_filename}"


def get_complaint_qr_url(complaint_id: str) -> str:
    """
    Generates QR code pointing to the public verification trail of a resolved complaint.
    """
    public_url = f"{settings.APP_URL}/api/v1/public/complaints/{complaint_id}"
    filename = f"qr_complaint_{complaint_id}.png"
    return generate_qr_code_image(public_url, filename)
