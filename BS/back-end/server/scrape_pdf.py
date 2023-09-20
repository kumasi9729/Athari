import spacy
import re
import json
import sys
import logging
from pdfminer.high_level import extract_text
import nltk
from nltk.corpus import stopwords

logging.basicConfig(level=logging.INFO)

nlp = spacy.load("en_core_web_md")
stop_words = set(stopwords.words('english'))

HBCUs = [
    "Howard University", "Spelman College", "Hampton University", "Morehouse College", 
    "North Carolina A&T State University", "Tuskegee University", "Xavier University of Louisiana", 
    "Florida A&M University", "Jackson State University", "Delaware State University", 
    "Tennessee State University", "Alabama A&M University", "Alabama State University", 
    "Alcorn State University", "Bethune-Cookman University", "Bowie State University", 
    "Central State University", "Charles R. Drew University of Medicine and Science", 
    "Clark Atlanta University", "Coppin State University", "Elizabeth City State University", 
    "Fayetteville State University", "Fisk University", "Grambling State University", 
    "Harris–Stowe State University"
]

def extract_data_from_pdf(pdf_path):
    try:
        text = extract_text(pdf_path)
    except Exception as e:
        logging.error(f"Error reading PDF: {e}")
        return {}

    doc = nlp(text)

    data = {}

    # Attempt to find the name, considering it might be in the header
    top_of_resume = list(doc.sents)[:3]  # Check the first three sentences
    potential_names = []
    for sent in top_of_resume:
        potential_names.extend([ent.text for ent in nlp(sent.text).ents if ent.label_ == "PERSON"])
    data['name'] = potential_names[0] if potential_names else "Not Found"

    # Extract GPA
    gpa_match = re.search(r'GPA:\s*([\d\.]+)', text)
    if gpa_match:
        data['GPA'] = gpa_match.group(1)

    # Extract School Name and check for HBCU
    for ent in doc.ents:
        if ent.label_ == "ORG" and any(hbcu in ent.text for hbcu in HBCUs):
            data['school'] = ent.text
            data['is_HBCU'] = True

    # Extract Degree
    degrees = ["b.s.", "b.a.", "m.s.", "m.a.", "phd", "m.b.a"]
    for token in doc:
        if token.text.lower() in degrees:
            data['degree'] = token.text

    # Extract Years of Experience
    exp_years = re.search(r'(\d+\s*-\s*\d+\s*years|\d+\s+years)', text, re.I)
    if exp_years:
        data['years_of_experience'] = exp_years.group(1)

    # Extract Companies
    organizations = [ent.text for ent in doc.ents if ent.label_ == "ORG" and ent.text not in HBCUs]
    data['companies'] = list(set(organizations))  # Remove duplicates

    # Save extracted data
    pdf_name = pdf_path.split('/')[-1]
    output_filename = pdf_name.rsplit('.', 1)[0] + ".json"

    with open(output_filename, 'w') as out_file:
        json.dump(data, out_file)

    logging.info(f"Data extracted and saved to {output_filename}")

    return {"data": data, "filename": output_filename}

if __name__ == '__main__':
    if len(sys.argv) < 2:
        logging.error("Please provide a PDF file path as an argument.")
        sys.exit(1)

    result = extract_data_from_pdf(sys.argv[1])
    print(json.dumps(result))
