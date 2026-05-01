import sys

def analyze_intent(path, count):
    path = path.lower()

    # 1. CEK WHITE LIST DULU (Tamu Kehormatan - Favicon dkk)
    white_list = ['favicon.ico', 'static/', 'assets/', 'robots.txt']
    if any(ws in path for ws in white_list):
        return "WHITE_LIST"

    # 2. CEK NIAT JAHAT (Evil Intent)
    malicious_paths = ['admin', 'config', 'shell', '.env', 'setup', 'phpinfo', 'metadata']
    if any(mp in path for mp in malicious_paths):
        return "BLACK_LIST"

    # 3. CEK FREKUENSI (Spamming Check)
    # Kalau bukan jahat tapi bolak-balik terus (lebih dari 7x), baru curigai
    if count > 7:
        return "BLACK_LIST"

    return "GREY_ZONE"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        # Default fallback
        print("GREY_ZONE")
    else:
        # Panggil fungsi dan cetak hasil untuk dibaca Bash
        print(analyze_intent(sys.argv[1], int(sys.argv[2])))
