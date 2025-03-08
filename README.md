# LLM
https://huggingface.co/mosaicml/mpt-7b-storywriter

# How to Donwload LLM
https://huggingface.co/docs/hub/en/models-downloading
```
brew install git-lfs
git lfs clone https://huggingface.co/mosaicml/mpt-7b-storywriter
```

# Using Library
```python
from huggingface_hub import hf_hub_download
import joblib

REPO_ID = "YOUR_REPO_ID"
FILENAME = "sklearn_model.joblib"

model = joblib.load(
    hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
)
```

# How to use 
`npm i node`