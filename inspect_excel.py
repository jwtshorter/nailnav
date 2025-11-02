#!/usr/bin/env python3
"""
Inspect the Excel file structure to understand the data format
"""
import pandas as pd
import sys

def inspect_excel(file_path):
    """Inspect Excel file structure"""
    print(f"Reading Excel file: {file_path}\n")
    
    try:
        # Read the Excel file
        df = pd.read_excel(file_path, sheet_name=0)
        
        print(f"Total rows: {len(df)}")
        print(f"Total columns: {len(df.columns)}")
        print(f"\nColumn names:")
        for i, col in enumerate(df.columns, 1):
            print(f"  {i}. {col}")
        
        print(f"\nFirst 3 rows sample:")
        print("=" * 100)
        pd.set_option('display.max_columns', None)
        pd.set_option('display.width', None)
        pd.set_option('display.max_colwidth', 50)
        print(df.head(3).to_string())
        
        print(f"\n\nData types:")
        print("=" * 100)
        print(df.dtypes)
        
        print(f"\n\nNull values count:")
        print("=" * 100)
        print(df.isnull().sum())
        
        return df
        
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    df = inspect_excel("Nail_Salons_Aus_250.xlsx")
