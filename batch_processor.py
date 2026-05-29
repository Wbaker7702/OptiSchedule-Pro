import pandas as pd
import json
import datetime
from multiprocessing import Pool
from invoice_mapper import InvoiceMapper

def generate_single_invoice(data):
    try:
        mapper = InvoiceMapper('template.xlsx', f"output/invoice_{data['id']}.xlsx")
        mapper.generate_invoice(data)
        return {
            "id": data['id'],
            "status": "success",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "file": f"output/invoice_{data['id']}.xlsx"
        }
    except Exception as e:
        return {
            "id": data.get('id'),
            "status": "error",
            "message": str(e)
        }

def run_batch_processor(all_data):
    df = pd.DataFrame(all_data)
    clean_data = [row.to_dict() for _, row in df.iterrows()]
    
    with Pool() as pool:
        results = pool.map(generate_single_invoice, clean_data)
    
    manifest = {
        "batch_id": datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d%H%M%S"),
        "total_records": len(all_data),
        "results": results
    }
    
    with open('batch_manifest.json', 'w') as f:
        json.dump(manifest, f, indent=4)
        
    print("Batch processing complete.")

if __name__ == '__main__':
    mock_data = [{'id': i, 'property_address': f'Addr {i}', 'tenant_name': f'Tenant {i}'} for i in range(5)]
    run_batch_processor(mock_data)

