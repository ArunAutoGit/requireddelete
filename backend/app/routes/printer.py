# app/routes/printer.py
from fastapi import APIRouter, HTTPException, status
from app.schemas.print import PrintJobRequest, PrintJobResponse, PrinterStatus
from app.services.printer_service import PrinterService

router = APIRouter()

@router.post("/batch", response_model=PrintJobResponse)
async def print_batch_job(print_job: PrintJobRequest):
    """Receive print job from frontend and send to printer"""
    try:
        # Process print job
        printer_service = PrinterService()
        print_result = await printer_service.process_print_job(print_job)
        
        # Prepare response
        message = f"Printed {print_result['successful_prints']} out of {print_result['total_labels']} labels"
        
        return PrintJobResponse(
            status="completed",
            message=message,
            result=print_result
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Print job failed: {str(e)}"
        )

@router.get("/printer/status", response_model=PrinterStatus)
async def get_printer_status():
    """Check printer status"""
    printer_service = PrinterService()
    status = await printer_service.check_printer_status()
    return status

@router.post("/printer/toggle-simulation")
async def toggle_printer_simulation(enable: bool = True):
    """Toggle printer simulation mode (for testing)"""
    printer_service = PrinterService()
    printer_service.simulate_printer = enable
    return {
        "status": "success",
        "message": f"Printer simulation {'enabled' if enable else 'disabled'}",
        "simulation_mode": enable
    }