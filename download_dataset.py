# """
# Download specific folders from Kaggle Crime Dataset
# Compatible with kaggle >= 1.7.x (new token system)
# """

# import os
# import subprocess
# import json
# from pathlib import Path

# # ============================================================
# # CONFIGURATION — Fill these in
# # ============================================================

# KAGGLE_USERNAME = "mayuriraskar"
# KAGGLE_KEY      = "KGAT_c070542c0ede22206325d2326ad526a6"   # your token

# DATASET_OWNER   = "webadvisor"        # from the Kaggle dataset URL
# DATASET_NAME    = "real-time-anomaly-detection-in-cctv-surveillance"     # from the Kaggle dataset URL

# TARGET_FOLDERS  = ["abuse", "explosion", "fighting", "normal", "robbery", "stealing"]

# DOWNLOAD_DIR    = r"D:\projects\edp\Guardian-Eye---CCTV-anomaly-detection\dataset"

# # ============================================================
# # SETUP
# # ============================================================

# def setup_kaggle_credentials():
#     kaggle_dir = Path.home() / ".kaggle"
#     kaggle_dir.mkdir(exist_ok=True)
#     cred_path  = kaggle_dir / "kaggle.json"
#     creds = {"username": KAGGLE_USERNAME, "key": KAGGLE_KEY}
#     with open(cred_path, "w") as f:
#         json.dump(creds, f)
#     try:
#         os.chmod(cred_path, 0o600)
#     except Exception:
#         pass
#     print(f"✅ Credentials saved to: {cred_path}")

# # ============================================================
# # DOWNLOAD
# # ============================================================

# def run(cmd):
#     """Run a shell command and stream output."""
#     result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
#     if result.stdout:
#         print(result.stdout)
#     if result.stderr:
#         print(result.stderr)
#     return result.returncode

# def get_all_files():
#     """Get list of all files in the dataset via CLI."""
#     dataset_id = f"{DATASET_OWNER}/{DATASET_NAME}"
#     result = subprocess.run(
#         f"kaggle datasets files {dataset_id} --csv",
#         shell=True, capture_output=True, text=True
#     )
#     if result.returncode != 0:
#         print(f"❌ Could not list files:\n{result.stderr}")
#         print("\n💡 Make sure you accepted the dataset rules on Kaggle website first!")
#         return []

#     lines = result.stdout.strip().split("\n")
#     # First line is header: name,size,creationDate
#     files = [line.split(",")[0] for line in lines[1:] if line.strip()]
#     return files

# def download_files():
#     dataset_id = f"{DATASET_OWNER}/{DATASET_NAME}"
#     os.makedirs(DOWNLOAD_DIR, exist_ok=True)

#     print(f"\n📋 Fetching file list for: {dataset_id} ...")
#     all_files = get_all_files()

#     if not all_files:
#         return

#     # Filter: only target folders + CSV files
#     target_files = []
#     for f in all_files:
#         f_lower = f.replace("\\", "/").lower()
#         is_target = any(f_lower.startswith(f"data/{folder}/") or
#                         f"/{folder}/" in f_lower
#                         for folder in TARGET_FOLDERS)
#         is_csv = f_lower.endswith(".csv")
#         if is_target or is_csv:
#             target_files.append(f)

#     print(f"🎯 {len(target_files)} files matched (from {len(all_files)} total)\n")

#     failed = []
#     for i, filepath in enumerate(target_files, 1):
#         print(f"[{i}/{len(target_files)}] {filepath}")
#         code = run(
#             f'kaggle datasets download {dataset_id} '
#             f'--file "{filepath}" '
#             f'--path "{DOWNLOAD_DIR}" '
#             f'--unzip'
#         )
#         if code != 0:
#             failed.append(filepath)

#     print("\n" + "="*50)
#     print(f"✅ Done! Downloaded to: {DOWNLOAD_DIR}")
#     if failed:
#         print(f"⚠️  {len(failed)} files failed:")
#         for f in failed:
#             print(f"   - {f}")

# # ============================================================
# # MAIN
# # ============================================================

# if __name__ == "__main__":
#     print("=" * 55)
#     print("  Crime Dataset — Selective Folder Downloader")
#     print("=" * 55)
#     print(f"\n📂 Target folders : {', '.join(TARGET_FOLDERS)}")
#     print(f"💾 Save location  : {DOWNLOAD_DIR}\n")

#     setup_kaggle_credentials()
#     download_files()



"""
Downloads the full dataset zip, extracts it,
then DELETES the folders you don't need.
Final result: only your target folders remain.
"""

import os
import json
import shutil
import subprocess
from pathlib import Path

# ============================================================
# CONFIGURATION
# ============================================================

KAGGLE_USERNAME = "mayuriraskar"
KAGGLE_KEY      = "KGAT_c070542c0ede22206325d2326ad526a6"

DATASET_OWNER   = "webadvisor"
DATASET_NAME    = "real-time-anomaly-detection-in-cctv-surveillance"

# Folders you WANT to keep
KEEP_FOLDERS = ["abuse", "explosion", "fighting", "normal", "robbery", "stealing"]

# Where to save
DOWNLOAD_DIR = r"D:\projects\edp\Guardian-Eye---CCTV-anomaly-detection\dataset"

# ============================================================
# SETUP CREDENTIALS
# ============================================================

def setup_credentials():
    kaggle_dir = Path.home() / ".kaggle"
    kaggle_dir.mkdir(exist_ok=True)
    cred_path = kaggle_dir / "kaggle.json"
    with open(cred_path, "w") as f:
        json.dump({"username": KAGGLE_USERNAME, "key": KAGGLE_KEY}, f)
    try:
        os.chmod(cred_path, 0o600)
    except Exception:
        pass
    print(f"✅ Credentials set.")

# ============================================================
# DOWNLOAD FULL ZIP
# ============================================================

def download_full_dataset():
    dataset_id = f"{DATASET_OWNER}/{DATASET_NAME}"
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    print(f"\n📦 Downloading full dataset zip: {dataset_id}")
    print(f"💾 Saving to: {DOWNLOAD_DIR}")
    print("⏳ This may take a while (large dataset)...\n")

    result = subprocess.run(
        f'kaggle datasets download {dataset_id} --path "{DOWNLOAD_DIR}" --unzip',
        shell=True
    )

    if result.returncode != 0:
        print("❌ Download failed! Check your credentials and dataset name.")
        return False

    print("\n✅ Download + extraction complete!")
    return True

# ============================================================
# DELETE UNWANTED FOLDERS
# ============================================================

def cleanup_unwanted_folders():
    data_dir = Path(DOWNLOAD_DIR) / "data"

    if not data_dir.exists():
        # Maybe extracted directly without a 'data' subfolder
        data_dir = Path(DOWNLOAD_DIR)

    print(f"\n🧹 Cleaning up unwanted folders in: {data_dir}")

    all_folders = [f for f in data_dir.iterdir() if f.is_dir()]

    kept    = []
    deleted = []

    for folder in all_folders:
        if folder.name.lower() in [k.lower() for k in KEEP_FOLDERS]:
            kept.append(folder.name)
            print(f"  ✅ Keeping : {folder.name}")
        else:
            shutil.rmtree(folder)
            deleted.append(folder.name)
            print(f"  🗑️  Deleted : {folder.name}")

    print(f"\n📊 Summary:")
    print(f"   Kept    : {kept}")
    print(f"   Deleted : {deleted}")
    print(f"\n✅ All done! Your dataset folder is clean.")

# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    print("=" * 55)
    print("  Crime Dataset Downloader — Full Zip Method")
    print("=" * 55)
    print(f"\n📂 Folders to keep : {', '.join(KEEP_FOLDERS)}")
    print(f"💾 Location        : {DOWNLOAD_DIR}\n")

    setup_credentials()

    success = download_full_dataset()

    if success:
        cleanup_unwanted_folders()