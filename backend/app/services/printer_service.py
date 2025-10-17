import aiohttp
import asyncio
from typing import Optional, Dict, Any
from datetime import datetime
import logging
from app.schemas.print import PrintJobRequest, PrinterStatus

logger = logging.getLogger(__name__)

class PrinterService:
    def __init__(self):
        self.printer_config = {
            'default': {'ip': '192.168.1.100', 'port': 9100, 'type': 'zpl'},
            'backup': {'ip': '192.168.1.101', 'port': 9100, 'type': 'zpl'}
        }
        self.simulate_printer = True  # Set to False when you have real printer
    
    async def send_to_printer(self, zpl_code: str, printer_ip: str = None) -> bool:
        """Send ZPL code to network printer or simulate printing"""
        if self.simulate_printer:
            return await self._simulate_print(zpl_code)
        else:
            return await self._actual_print(zpl_code, printer_ip)
    
    async def _simulate_print(self, zpl_code: str) -> bool:
        """Simulate printing for development"""
        try:
            # Simulate network delay
            await asyncio.sleep(0.5)
            
            # Log the ZPL code for verification
            logger.info(f"SIMULATED PRINT - ZPL Code length: {len(zpl_code)}")
            logger.debug(f"ZPL Content:\n{zpl_code}")
            
            # Simulate occasional failures (10% chance)
            import random
            if random.random() < 0.1:
                logger.warning("SIMULATED PRINT FAILURE")
                return False
            
            logger.info("SIMULATED PRINT SUCCESS")
            return True
            
        except Exception as e:
            logger.error(f"Simulated print error: {e}")
            return False
    
    async def _actual_print(self, zpl_code: str, printer_ip: str = None) -> bool:
        """Actual printer communication - for when you have a real printer"""
        if not printer_ip:
            printer_ip = self.printer_config['default']['ip']
        
        printer_url = f"http://{printer_ip}:9100"
        
        try:
            timeout = aiohttp.ClientTimeout(total=30)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(
                    printer_url,
                    data=zpl_code,
                    headers={'Content-Type': 'application/zpl'}
                ) as response:
                    success = response.status == 200
                    if success:
                        logger.info(f"Successfully printed to {printer_ip}")
                    else:
                        logger.error(f"Printer returned status: {response.status}")
                    return success
                    
        except aiohttp.ClientError as e:
            logger.error(f"Network error printing to {printer_ip}: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error printing to {printer_ip}: {e}")
            return False
    
    async def check_printer_status(self, printer_ip: str = None) -> PrinterStatus:
        """Check if printer is online"""
        if not printer_ip:
            printer_ip = self.printer_config['default']['ip']
        
        if self.simulate_printer:
            # Simulate printer status check
            return PrinterStatus(
                printer_type='zpl',
                is_online=True,
                ip_address=printer_ip,
                last_check=datetime.now()
            )
        else:
            # Actual printer status check
            try:
                printer_url = f"http://{printer_ip}:9100"
                timeout = aiohttp.ClientTimeout(total=5)
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    async with session.get(printer_url) as response:
                        is_online = response.status in [200, 400]  # Some printers respond with 400 for GET
                        return PrinterStatus(
                            printer_type='zpl',
                            is_online=is_online,
                            ip_address=printer_ip,
                            last_check=datetime.now()
                        )
            except:
                return PrinterStatus(
                    printer_type='zpl',
                    is_online=False,
                    ip_address=printer_ip,
                    last_check=datetime.now()
                )
    
    async def process_print_job(self, print_job: PrintJobRequest) -> dict:
        """Process a print job (simulated or real)"""
        results = {
            'batch_id': print_job.batch_id,
            'printer_type': print_job.printer_type,
            'total_labels': len(print_job.labels),
            'successful_prints': 0,
            'failed_prints': 0,
            'simulated': self.simulate_printer,
            'details': []
        }
        
        # Print each label
        for label in print_job.labels:
            success = await self.send_to_printer(label.zpl_code)
            
            if success:
                results['successful_prints'] += 1
                results['details'].append({
                    'sequence': label.sequence,
                    'unique_num': label.unique_num,
                    'status': 'printed'
                })
            else:
                results['failed_prints'] += 1
                results['details'].append({
                    'sequence': label.sequence,
                    'unique_num': label.unique_num,
                    'status': 'failed'
                })
            
            # Small delay between prints
            await asyncio.sleep(0.1)
        
        return results