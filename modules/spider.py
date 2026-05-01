import requests
from bs4 import BeautifulSoup
import sys

def crawl(url):
    print(f"🕵️ Spider v2.1: Menelusuri {url}...")
    try:
        headers = {'User-Agent': 'Dream-OS-Spider/2.1 (Ghost Architect)'}
        r = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(r.text, 'html.parser')
        
        # Ambil semua link dan judul
        title = soup.title.string if soup.title else "No Title"
        links = [a.get('href') for a in soup.find_all('a', href=True)][:10]
        
        print(f"✅ Target: {title}")
        print(f"🔗 Link Ditemukan: {len(links)}")
        return {"title": title, "links": links}
    except Exception as e:
        print(f"❌ Spider Error: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        crawl(sys.argv[1])
    else:
        print("Usage: python3 spider.py <url>")
