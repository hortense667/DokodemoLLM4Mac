#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# (c) 2025 Satoshi Endo

# OpenAIのAPIを呼び出すプログラムです
# 環境変数「OPENAI_API_KEY」にAPIキーをセットしておいてください。
# プロンプトを標準入力から受け取る
# 形式は、{プロンプト}---USER_TEXT---{処理対象テキスト}
# 結果は標準出力されます。

import os
import openai
import sys
import os
from pathlib import Path

def get_api_key(key_name):
    """環境変数または設定ファイルからAPIキーを取得する"""
    # 1. 環境変数から試す
    api_key = os.getenv(key_name)
    if api_key:
        return api_key

    # 2. 設定ファイルから試す (macOSの推奨設定場所)
    try:
        config_dir = Path.home() / "Library/Application Support/DokodemoLLM"
        config_path = config_dir / "api_keys.txt"
        if config_path.exists():
            with open(config_path, "r") as f:
                for line in f:
                    if line.strip().startswith(f"{key_name}="):
                        return line.split("=", 1)[1].strip()
    except Exception:
        pass  # エラーの場合は次のステップへ

    return None

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
    # 1) 標準入力からペイロード取得
    try:
        data = sys.stdin.read()
    except Exception as e:
        print("Stdin read error:", e)
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

    api_key = get_api_key("OPENAI_API_KEY")
    if not api_key:
        print("APIキーが見つかりません。~/Library/Application Support/DokodemoLLM/api_keys.txt ファイルを作成してください。")
        return

    client = openai.OpenAI(api_key=api_key)
    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[
               {"role": "system", "content": system_prompt.strip()},
                {"role": "user", "content": user_text.strip()},
            ],
            temperature=0.7,
            max_tokens=4096,
        )
        result = resp.choices[0].message.content.strip()
        if "append_citation" in locals():
            result += "\n\n---\n※この回答にはウェブ検索を使用しました。\n参考URL:\n" + "\n".join(citation_urls)
    except Exception as e:
        print("OpenAI API error:", e)
        return
            

    print(result)


if __name__ == "__main__":
    main()