from PIL import Image
import sys
import os

def process_image(input_path, output_path=None):
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Convert to RGB (24-bit)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize to 240 (width) x 288 (height)
            img_resized = img.resize((240, 288), Image.Resampling.LANCZOS)
            
            if output_path is None:
                base, ext = os.path.splitext(input_path)
                output_path = f"{base}_final.jpg" # Force .jpg
            
            # Save with 300 DPI and adjust quality to stay within 4-50 KB
            # Initial quality
            quality = 95
            img_resized.save(output_path, "JPEG", dpi=(300, 300), quality=quality)
            
            # Check size and adjust if necessary
            file_size = os.path.getsize(output_path) / 1024 # in KB
            
            while file_size > 50 and quality > 10:
                quality -= 5
                img_resized.save(output_path, "JPEG", dpi=(300, 300), quality=quality)
                file_size = os.path.getsize(output_path) / 1024
            
            while file_size < 4 and quality < 100:
                quality += 2
                img_resized.save(output_path, "JPEG", dpi=(300, 300), quality=quality)
                file_size = os.path.getsize(output_path) / 1024

            print(f"Success! Image saved to: {output_path}")
            print(f"Dimensions: {img_resized.size} (Width x Height)")
            print(f"DPI: 300x300")
            print(f"File Size: {file_size:.2f} KB")
            print(f"Quality used: {quality}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_image.py <image_path>")
    else:
        input_image = sys.argv[1]
        process_image(input_image)
