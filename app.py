from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="Finova Banking Portal",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="collapsed",
)

BASE_DIR = Path(__file__).parent

html = (BASE_DIR / "index.html").read_text(encoding="utf-8")
css = (BASE_DIR / "style.css").read_text(encoding="utf-8")
data_js = (BASE_DIR / "data.js").read_text(encoding="utf-8")
app_js = (BASE_DIR / "app.js").read_text(encoding="utf-8")

# Inline the local assets so the dashboard works inside Streamlit's HTML component.
html = html.replace(
    '<link rel="icon" type="image/svg+xml" href="favicon.svg?v=2" />',
    ''
).replace(
    '<link rel="shortcut icon" href="favicon.svg?v=2" />',
    ''
).replace(
    '<link rel="stylesheet" href="style.css" />',
    '<style>' + css + '</style>'
).replace(
    '<script src="data.js"></script>',
    '<script>' + data_js + '</script>'
).replace(
    '<script src="app.js"></script>',
    '<script>' + app_js + '</script>'
)

# Give the embedded dashboard enough vertical room; the component itself can scroll.
components.html(html, height=1100, scrolling=True)
