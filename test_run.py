from invoice_mapper import InvoiceMapper
import openpyxl

# 1. Ensure you have a 'template.xlsx' in the same directory
# 2. Configure the data
test_data = {
    'property_address': '123 Tech Way',
    'tenant_name': 'Enterprise Client A',
    'lease_start': '2026-06-01',
    'base_fee': 5000
}

# 3. Initialize and Run
mapper = InvoiceMapper('template.xlsx', 'test_output.xlsx')
mapper.generate_invoice(test_data)

print("Test complete. Check 'test_output.xlsx' for results.")
