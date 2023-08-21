const PDFDocument = require('pdfkit');
const conexion = require('../database/db');

exports.generatePDF = (req, res) => {
    const IdPago = req.params.IdPago;

    const query = 'SELECT d.*, r.IdCliente, c.Nombres, c.Apellidos FROM pagos d LEFT JOIN reservahab r ON d.IdReservaH = r.IdReservaH LEFT JOIN cliente c ON r.IdCliente = c.IdCliente WHERE IdPago= ?'
    conexion.query(query, [IdPago], (error, results) => {
        if (error) {
            console.error('Error al obtener los detalles del pago:', error);
            res.status(500).send('Error al obtener los detalles del pago');
        }
        else {
            const pago = results[0];
            
            const doc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="comprobante_pago_${IdPago}.pdf"`);

            // Pipe el contenido del PDF al objeto de respuesta HTTP
            doc.pipe(res);

            const columnWidth = 100;
            const columnGap = 50;

            // Una columna para el logo y otra para el detalle de la empresa
            doc.image('img/logolcdmv.png', columnGap, 5, { scale: 0.25, width: columnWidth });
            
            doc.font('Helvetica').fontSize(14).text('La Casa De Mi Viejo', columnGap + columnWidth + 20, 30, { align: 'right' });
            doc.font('Helvetica').fontSize(10).text('RUC: 98725654628', columnGap + columnWidth + 20, 50, { align: 'right' });

            // Separador de la tabla
            doc.moveDown().strokeColor('#000').lineWidth(1).moveTo(100, doc.y + 30).lineTo(500, doc.y + 30).stroke();

            doc.moveDown().font('Helvetica').fontSize(14).text('Comprobante de Pago', columnGap, doc.y + 35, { align: 'center' });
            doc.moveDown().font('Helvetica').fontSize(10).text(`${pago.Comprobante}`, columnGap, doc.y + 4, { align: 'center' });

            // Separador de la tabla
            doc.moveDown().strokeColor('#000').lineWidth(1).moveTo(100, doc.y +5).lineTo(500, doc.y +5).stroke();

             // Agregar tabla con 2 columnas de detalles del pago
             const tableData = [
                [`Alquiler`, `Habitacion`],
                [`Nombres`, `${pago.Nombres}`],
                [`Apellidos`, `${pago.Apellidos}`],
                [`Tipo de Pago`, `${pago.TipoPago}`],
                [`Fecha de Emisión`, `${pago.FEmision.toLocaleDateString('es-ES')}`],
                [`Total`, `S/. ${pago.TotalP}.00`]
            ];

            const columnWidths = [310, 80]; // Ancho de cada columna
            const rowHeight = 10; // Altura de la fila

            doc.moveDown().font('Helvetica').fontSize(10);

            tableData.forEach((row, rowIndex) => {
                const yPos = doc.y + rowIndex * rowHeight;
    
                if (rowIndex === tableData.length - 1) {
                    // Colorear la última fila con un color específico
                    doc.fillColor('#F0F0F0').rect(100, yPos - 5, columnWidths[0] + columnWidths[1], rowHeight + 10).fill();
                }

                doc.fillColor('#000').text(row[0], 100, yPos, { width: columnWidths[0], align: 'right' });
                doc.fillColor('#000').text(row[1], 100 + columnWidths[0], yPos, { width: columnWidths[1], align: 'right' });
            
            });

            // Finalizar el PDF
            doc.end();
            
        }
    });

}


exports.generatePDFSal = (req, res) => {
    const IdPagoS = req.params.IdPagoS;

    const query =  `SELECT d.*, r.IdCliente, c.Nombres, c.Apellidos FROM pagoss d LEFT JOIN reservasal r ON d.IdReserva=r.IdReserva LEFT JOIN cliente c ON r.IdCliente= c.IdCliente WHERE IdPagoS=?;`
    conexion.query(query, [IdPagoS], (error, results) => {
        if (error) {
            console.error('Error al obtener los detalles del pago:', error);
            res.status(500).send('Error al obtener los detalles del pago');
        }
        else {
            const pago = results[0];
            
            const doc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="comprobante_pago_${IdPagoS}.pdf"`);

            // Pipe el contenido del PDF al objeto de respuesta HTTP
            doc.pipe(res);

            const columnWidth = 100;
            const columnGap = 50;

            // Una columna para el logo y otra para el detalle de la empresa
            doc.image('img/logolcdmv.png', columnGap, 5, { scale: 0.25, width: columnWidth });
            
            doc.font('Helvetica').fontSize(14).text('La Casa De Mi Viejo', columnGap + columnWidth + 20, 30, { align: 'right' });
            doc.font('Helvetica').fontSize(10).text('RUC: 98725654628', columnGap + columnWidth + 20, 50, { align: 'right' });

            // Separador de la tabla
            doc.moveDown().strokeColor('#000').lineWidth(1).moveTo(100, doc.y + 30).lineTo(500, doc.y + 30).stroke();

            doc.moveDown().font('Helvetica').fontSize(14).text('Comprobante de Pago', columnGap, doc.y + 35, { align: 'center' });
            doc.moveDown().font('Helvetica').fontSize(10).text(`${pago.Comprobante}`, columnGap, doc.y + 4, { align: 'center' });

            // Separador de la tabla
            doc.moveDown().strokeColor('#000').lineWidth(1).moveTo(100, doc.y +5).lineTo(500, doc.y +5).stroke();

             // Agregar tabla con 2 columnas de detalles del pago
             const tableData = [
                [`Alquiler`, `Salon`],
                [`Nombres`, `${pago.Nombres}`],
                [`Apellidos`, `${pago.Apellidos}`],
                [`Tipo de Pago`, `${pago.TipoPago}`],
                [`Fecha de Emisión`, `${pago.FEmision.toLocaleDateString('es-ES')}`],
                [`Total`, `S/. ${pago.TotalP}.00`]
            ];

            const columnWidths = [310, 80]; // Ancho de cada columna
            const rowHeight = 10; // Altura de la fila

            doc.moveDown().font('Helvetica').fontSize(10);

            tableData.forEach((row, rowIndex) => {
                const yPos = doc.y + rowIndex * rowHeight;
    
                if (rowIndex === tableData.length - 1) {
                    // Colorear la última fila con un color específico
                    doc.fillColor('#F0F0F0').rect(100, yPos - 5, columnWidths[0] + columnWidths[1], rowHeight + 10).fill();
                }

                doc.fillColor('#000').text(row[0], 100, yPos, { width: columnWidths[0], align: 'right' });
                doc.fillColor('#000').text(row[1], 100 + columnWidths[0], yPos, { width: columnWidths[1], align: 'right' });
            
            });

            // Finalizar el PDF
            doc.end();
            
        }
    });

}




