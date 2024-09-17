import xmltodict
import json
import argparse

def convert_xml_to_json(xml_data):
    try:
        # Parse the XML data
        json_data = xmltodict.parse(xml_data)
        # Convert to JSON format (pretty-printed)
        json_output = json.dumps(json_data, indent=4)
        return json_output
    except Exception as e:
        return str(e)

def main():
    # Set up argument parsing
    parser = argparse.ArgumentParser(description="Convert XML file to JSON file.")
    parser.add_argument('-x', '--xml', required=True, help="Path to the input XML file")
    parser.add_argument('-o', '--output', required=True, help="Path to the output JSON file")
    args = parser.parse_args()

    # Read the XML data from the provided XML file path
    try:
        with open(args.xml, "r") as xml_file:
            xml_data = xml_file.read()
    except Exception as e:
        print(f"Error reading XML file: {e}")
        return

    # Convert XML to JSON
    json_output = convert_xml_to_json(xml_data)

    # Write the JSON output to the provided JSON file path
    try:
        with open(args.output, "w") as json_file:
            json_file.write(json_output)
    except Exception as e:
        print(f"Error writing JSON file: {e}")
        return

    print(f"JSON data saved to {args.output}")

if __name__ == "__main__":
    main()
