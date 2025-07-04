import { format } from 'date-fns';

import { statusColorMap } from '@/lib/maps';
import { AppointmentType } from '@/types/appointment';

export function Receipt(appointment: AppointmentType) {
  return `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Receipt</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                color: #333;
            }

            .logo {
                text-align: center;
            }

            .title {
                color: #73CD7D;
                font-size: 32px;
                margin-bottom: 20px;
                font-weight: 700;
                text-align: center;
            }

            .receipt-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                border-bottom: 1px solid #eee;
                padding-bottom: 8px;
            }
            .receipt-row:last-child {
                border-bottom: none;
            }
            .label {
                color: #666;
                font-size: 1.1rem;
            }
            .value {
                font-size: 1.1rem;
                font-weight: 500;
            }
            .status {
                color: ${statusColorMap[appointment.status]};
                padding: 8px 16px;
                border-radius: 12px;
                text-transform: capitalize;
            }
            .qr-code {
                display: block;
                margin: 30px auto;
                max-width: 200px;
            }
        </style>
    </head>
    <body>
        <div class="logo">
            <img src="${process.env.NEXT_PUBLIC_URL}logo.png" alt="Logo" style="display: block; margin: 0 auto; max-width: 100px;">
        </div>
        <h1 class="title">Appointment Receipt</h1>
        <div class="receipt">
            <div class="receipt-row">
                <span class="label">Appointment ID</span>
                <span class="value">#${appointment.aid}</span>
            </div>
            
            <div class="receipt-row">
                <span class="label">Date & Time</span>
                <span class="value">${format(appointment.date, 'PPPp')}</span>
            </div>
            
            <div class="receipt-row">
                <span class="label">Status</span>
                <span class="value status">${appointment.status}</span>
            </div>
            
            <div class="receipt-row">
                <span class="label">Patient</span>
                <span class="value">${appointment.patient.name}</span>
            </div>
            
            <div class="receipt-row">
                <span class="label">Phone Number</span>
                <span class="value">${appointment.patient?.phone || '-'}</span>
            </div>
            
            <div class="receipt-row">
                <span class="label">Doctor</span>
                <span class="value">${appointment.doctor?.name || '-'}</span>
            </div>
            
            <div class="receipt-row">
                <span class="label">Booked On</span>
                <span class="value">${format(appointment.createdAt, 'PPPp')}</span>
            </div>

            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${process.env.NEXT_PUBLIC_URL}/appointments/${appointment.aid}" alt="Appointment QR Code" class="qr-code">
        </div>
    </body>
</html>`;
}
