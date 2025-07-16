#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# (c) 2025 Satoshi Endo

# GeminiのAPIを呼び出すプログラムです
# 環境変数「GEMINI_API_KEY」にAPIキーをセットしておいてください。
# プロンプトをクリップボードにセットして呼び出す
# 形式は、{プロンプト}---USER_TEXT---{処理対象テキスト}
# 結果は標準出力されます。

import os
import google.generativeai as genai
import pyperclip

import requests
from bs4 import BeautifulSoup
def fetch_page_excerpt(url, max_chars=1000):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator='\n')
        text = ' '.join(text.split())
        return text[:max_chars]
    except Exception as e:
        return f"[ページ本文取得エラー: {e}]"


def search_web(query):
    url_list = []  # to store URLs for citation
    url = "https://html.duckduckgo.com/html/"
    headers = {"User-Agent": "Mozilla/5.0"}
    params = {"q": query}
    response = requests.post(url, headers=headers, data=params)
    soup = BeautifulSoup(response.text, "html.parser")
    results = []
    for a in soup.select("a.result__a")[:3]:
        title = a.text.strip()
        href = a.get("href")
        results.append(f"{title} - {href}")
        url_list.append(href)
    return "\n".join(results), url_list

def main():
    # 1) クリップボードからペイロード取得
    try:
        data = pyperclip.paste()
    except Exception as e:
        print("Clipboard read error:", e)
        return

    # 2) ペイロード分割
    separator = "---USER_TEXT---"
    if separator not in data:
        print("Invalid payload format")
        return

    system_prompt, user_text = data.split(separator, 1)

    # 3) Gemini API 呼び出し

    # Check for /w suffix in system_prompt
    do_web_search = system_prompt.strip().endswith("/w")
    if do_web_search:
        system_prompt = system_prompt.strip()[:-2].strip()  # Remove /w
        search_results, cited_urls = search_web(user_text.strip())
#        print("[DEBUG] Web Search Results:" + search_results + "")
        page_excerpts = []
        for i, url in enumerate(cited_urls[:3]):
            excerpt = fetch_page_excerpt(url)
            page_excerpts.append(f"[{i+1}] {url}\n{excerpt}\n")
        all_excerpts = "".join(page_excerpts)
        print("[DEBUG2] Web Page Excerpts:" + all_excerpts + "")
#        user_text = f"以下はウェブ検索結果です：\n{search_results}\n\n以下は検索上位ページの本文抜粋です：\n{all_excerpts}\n質問：{user_text.strip()}"
        user_text = f"{user_text.strip()}\n###以下の検索結果も必要に応じて参照してください：\n{all_excerpts}\n"
        append_citation = True
        citation_urls = cited_urls

    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    model = genai.GenerativeModel("gemini-2.5-flash")  # 最新モデルを指定
    try:
        response = model.generate_content(
            [ 
                {"role": "user", "parts": [system_prompt.strip()+"###結果のみ返す。「承知しました」など不要"]},
                {"role": "user", "parts": [user_text.strip()]}
            ]
        )
        result = response.text
        if "append_citation" in locals():
            result += "\n\n---\n※この回答にはウェブ検索を使用しました。\n参考URL:\n" + "\n".join(citation_urls)
    except Exception as e:
        print("Gemini API error:", e)
        return

    print(result)


if __name__ == "__main__":
    main()
