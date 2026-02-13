# At the top of app.py
from validator import validate_labor_spend

# Now you can use that function anywhere in this file!
result = validate_labor_spend(2500, 10000, 20)
print(result)
