# Setup
## 1. Setup lib
```
    pip3 install -r requirements.txt
```

## 2. Download weight
```
    gdown --id 1hL8DrOrGGgTQXnX7QgWq78VmO1OyuPwT -O src/models/deeptext_vie.pth #deeptext
    gdown --id 13HNNm4Cdj_nnLjy5LaXuRD_l-W8gVx1d -O src/models/craft_mlt_25k.pth #CRAFT
```

# Run pipeline
```
    python3 src/predict.py
```