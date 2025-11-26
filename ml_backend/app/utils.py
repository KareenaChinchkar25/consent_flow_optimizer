def risk_to_category(risk_score):
    """
    Convert numerical risk score to category
    """
    if risk_score >= 0.7:
        return 'High'
    elif risk_score >= 0.4:
        return 'Medium'
    else:
        return 'Low'

def validate_input_data(df):
    """
    Validate input dataframe has required columns
    """
    required_columns = ['platform', 'permission', 'category', 'purpose', 'status']
    
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")
    
    return True