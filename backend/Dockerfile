# Gunakan image Python dasar
FROM python:3.11-slim

# Set working directory di dalam container
WORKDIR /app

# Salin requirements.txt dan instal dependensi terlebih dahulu
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Salin sisa kode aplikasi Flask
COPY . .

# Port yang digunakan oleh Flask (untuk dokumentasi)
EXPOSE 5003

# Command untuk menjalankan aplikasi
CMD ["python", "app.py"]