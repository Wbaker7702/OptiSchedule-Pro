import openpyxl

class InvoiceMapper:
    def __init__(self, template_path, output_path):
        self.template_path = template_path
        self.output_path = output_path
        self.field_map = {
            'property_address': (0, 0),
            'tenant_name': (1, 0),
            'lease_start': (2, 0),
            'base_fee': (3, 0)
        }

    def generate_invoice(self, data):
        wb = openpyxl.load_workbook(self.template_path)
        ws = wb.active
        start_row, start_col = 7, 7
        for key, (row_offset, col_offset) in self.field_map.items():
            if key in data:
                ws.cell(row=start_row + row_offset, 
                        column=start_col + col_offset, 
                        value=data[key])
        wb.save(self.output_path)

