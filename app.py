"""
TikTok Marketing Concept Generator
---------------------------------

This Streamlit application helps marketers and creators design a TikTok
account and content strategy tailored to their niche and audience.  
It gathers user inputs, outlines best‑practice guidelines sourced from
recent TikTok marketing research, and uses the OpenAI API to generate
a comprehensive plan that includes a unique concept, profile setup
recommendations, content strategy, hashtag guidance and safety
considerations.

Before running the app you should set your OpenAI API key in the
``OPENAI_API_KEY`` environment variable or via the Streamlit secrets
mechanism. Without a key the app will still display the guidelines and
example output but cannot call the API.

To run the application locally:

.. code-block:: bash

    pip install -r requirements.txt
    streamlit run app.py

Deployment
~~~~~~~~~~~

This app was designed to run on modern Python 3.8+ environments and
should deploy easily to platforms such as Streamlit Community
Cloud, Heroku, or any cloud provider supporting Python web apps.  
Streamlit Cloud is recommended for its simplicity: you push your
repository to GitHub, connect your account on Streamlit Cloud, and
deploy with a single click.
"""

import os
from typing import Dict, Any

import streamlit as st

try:
    import openai  # Optional: only used if an API key is provided
except ImportError:
    openai = None


def build_prompt(user_inputs: Dict[str, Any]) -> str:
    """Construct the system prompt for the OpenAI API call.

    The prompt includes recent guidelines about TikTok marketing and
    account setup along with the user's input to instruct the model
    precisely. By framing the guidelines explicitly we ensure the
    generated plan aligns with platform policies and best practices.

    Args:
        user_inputs: Dictionary of user supplied parameters.

    Returns:
        A formatted string suitable for the system message.
    """
    # Summarised guidelines extracted from research articles (see
    # accompanying citations in the README or external report).  
    # These guidelines are not exhaustive but cover key points such as
    # account setup, content types, video length, music usage, hashtags,
    # safety and compliance.
    guidelines = (
        "- **Account creation:** Provide valid contact information, accept"
        " TikTok’s terms of service, maintain unique credentials and"
        " complete additional verification steps for business accounts."
        " Always abide by TikTok’s community guidelines and do not share"
        " access across multiple people.\n"
        "- **Age and security:** Users must be at least 13 years old."
        " Teen accounts have restricted messaging and content visibility."
        " Enable strong passwords and two‑factor authentication.\n"
        "- **Profile setup:** Use a high quality headshot or logo, keep the"
        " username consistent across platforms and include a phrase about"
        " your niche in the name field to improve searchability. Craft a"
        " concise bio explaining who you are and what value you provide."
        " Pin up to three important posts (e.g. an intro, a series, or"
        " evergreen content).\n"
        "- **Acceptable content:** Focus on brand storytelling, educational"
        " or behind‑the‑scenes content, entertaining posts aligned with your"
        " values, and user‑generated testimonials. Avoid controversial or"
        " misleading topics.\n"
        "- **Videos:** TikTok supports up to 10‑minute videos recorded in"
        " app and 60‑minute uploads. Research shows videos longer than 60"
        " seconds get more reach. Experiment with various lengths, use"
        " duets, stitches and reply videos, and incorporate trending sounds"
        " from the commercial music library.\n"
        "- **Carousels:** You can add up to 35 images. Use them for story"
        " telling (e.g. tutorials or sequential narratives), ensure each"
        " slide is easily readable and maintain consistent brand colours"
        " and fonts.\n"
        "- **Text posts:** Enhance text‑only posts with stickers, music or"
        " coloured backgrounds. Keep them short and collaborate by tagging"
        " other accounts.\n"
        "- **Stories and Live:** Post behind‑the‑scenes content on stories"
        " that vanish after 24 hours and create exclusivity. Go live only"
        " if you’re over 18 and have more than 1,000 followers, and do so"
        " when your audience is online.\n"
        "- **Hashtags and captions:** Use 3–5 relevant hashtags per post,"
        " craft clear captions that encourage action and leverage trending"
        " tags. Avoid spam or overused hashtags.\n"
        "- **Music:** Only use tracks from TikTok’s commercial music"
        " library or original sounds to avoid copyright issues.\n"
        "- **Safety and prohibited content:** Do not create content involving"
        " harmful challenges, hate speech, adult content, misinformation or"
        " violence. Always prioritise audience well‑being."
    )

    # Compose the user specific context
    context_parts = []
    if user_inputs.get("niche"):
        context_parts.append(f"Niche: {user_inputs['niche']}")
    if user_inputs.get("audience"):
        context_parts.append(f"Target audience: {user_inputs['audience']}")
    if user_inputs.get("goals"):
        context_parts.append(f"Goals: {user_inputs['goals']}")
    if user_inputs.get("content_types"):
        types = ", ".join(user_inputs["content_types"])
        context_parts.append(f"Preferred content types: {types}")
    if user_inputs.get("frequency"):
        context_parts.append(f"Posting frequency: {user_inputs['frequency']} posts per week")
    if user_inputs.get("keywords"):
        context_parts.append(f"Additional keywords: {user_inputs['keywords']}")
    context = "\n".join(context_parts)

    prompt = (
        "You are a social media strategist tasked with creating a detailed "
        "TikTok marketing plan for a client. The plan should be clear,"
        " actionable and comply with TikTok’s latest rules.\n"
        "Guidelines:\n"
        f"{guidelines}\n"
        "Client context:\n"
        f"{context}\n"
        "Deliver a plan that includes:\n"
        "1. A short unique concept or theme for the TikTok account.\n"
        "2. Profile setup recommendations (photo, name, username, bio, pinned posts).\n"
        "3. Content strategy covering suggested formats, video lengths, posting schedule,"
        "   and feature use (duets, stitches, live, stories etc.).\n"
        "4. Hashtag and caption strategy, including examples of hashtags.\n"
        "5. Safety and compliance notes highlighting age restrictions, music use,"
        "   prohibited content and privacy considerations.\n"
        "Write in Japanese and format the output with clear section headings."
    )
    return prompt


def call_openai_api(prompt: str) -> str:
    """Call the OpenAI ChatCompletion API with the provided prompt.

    The function expects the ``openai`` module to be available and an API
    key to be set in the environment. If these conditions are not met
    it returns an empty string and the caller should fall back to a
    default response.

    Args:
        prompt: The system prompt to send to the model.

    Returns:
        The generated text from the OpenAI API, or an empty string on
        failure.
    """
    if openai is None:
        return ""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return ""
    try:
        openai.api_key = api_key
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt},
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        return response["choices"][0]["message"]["content"].strip()
    except Exception as e:
        # Log to console for debugging and return empty to use fallback
        print(f"OpenAI API call failed: {e}")
        return ""


def generate_fallback_plan(user_inputs: Dict[str, Any]) -> str:
    """Produce a basic plan without using the OpenAI API.

    This fallback uses static guidelines and user inputs to assemble a
    simple but actionable marketing plan. It ensures the app remains
    functional even without internet connectivity or an API key.

    Args:
        user_inputs: The user provided settings.

    Returns:
        A Japanese string representing the plan.
    """
    # Compose parts of the plan using user inputs and guidelines
    concept = (
        f"**コンセプト**\n"
        f"{user_inputs.get('niche', '未設定')}分野に特化したTikTokアカウントとして、"
        f"{user_inputs.get('audience', 'ターゲット未設定')}に対して価値ある情報と"
        "エンターテインメントを提供します。ブランドストーリーテリングと"
        "教育的な内容を組み合わせ、フォロワーに親近感を与えるテーマを設定します。"
    )

    profile = (
        "**プロフィール設定**\n"
        "- プロフィール写真は高品質な顔写真またはロゴを使用します。\n"
        "- 名前欄にはブランド名とニッチに関連するキーワードを含めます。\n"
        "- ユーザー名は他のSNSと一致させ、覚えやすくします。\n"
        "- バイオには誰なのか、どんな価値を提供するのかを簡潔に記述し、"
        "問い合わせ用メールアドレスも記載します。\n"
        "- ピン留め投稿として自己紹介動画や人気シリーズ動画など3本まで選びます。"
    )

    # Determine content formats
    formats = user_inputs.get("content_types", [])
    format_lines = []
    if "動画" in formats or not formats:
        format_lines.append(
            "- **動画**: 60秒以上の長さを含む様々な長さで実験し、デュエットや"
            "ステッチ、返信動画を活用します。トレンド音源を適宜組み合わせます。"
        )
    if "カルーセル" in formats:
        format_lines.append(
            "- **カルーセル**: 最大35枚の画像でストーリーを展開し、各スライドは"
            "読みやすく、ブランドカラーを統一します。"
        )
    if "テキスト" in formats:
        format_lines.append(
            "- **テキスト投稿**: ステッカーや音楽、背景色で視覚的に引き付け、"
            "短く簡潔な文章とタグ付け機能で他のクリエイターと連携します。"
        )
    if "ストーリー" in formats:
        format_lines.append(
            "- **ストーリー**: 舞台裏や1日密着コンテンツ、限定オファーなどを24時間限定で"
            "公開し、フォロワーとのエンゲージメントを高めます。"
        )
    if "ライブ" in formats:
        format_lines.append(
            "- **ライブ**: 18歳以上かつフォロワー1000人以上で利用可能。"
            "視聴者が多い時間帯にライブ配信を行います。"
        )
    content_strategy = "\n".join(format_lines)
    if not content_strategy:
        content_strategy = "- 適切なコンテンツ形式が選択されていません。動画やカルーセルなどを検討してください。"
    content_section = (
        "**コンテンツ戦略**\n"
        f"週間投稿回数: {user_inputs.get('frequency', '未設定')}回\n"
        f"{content_strategy}"
    )

    hashtag_section = (
        "**ハッシュタグとキャプション**\n"
        "各投稿で関連性の高いハッシュタグを3〜5個使用し、キャプションは"
        "行動を促す短い文章にします。トレンドハッシュタグを調査し、"
        "スパム的なタグの使用は避けてください。\n"
        "例: #ニッチ名 #商品名 #初心者向けガイド"
    )

    safety_section = (
        "**安全性とコンプライアンス**\n"
        "TikTokの利用規約を守り、13歳未満にはアカウントを提供しません。"
        "ティーン向けアカウントではメッセージ機能や閲覧範囲が制限されるため"
        "配慮が必要です。強力なパスワードと二段階認証を有効にし、著作権侵害を"
        "避けるため商用音楽ライブラリを利用します。危険なチャレンジや暴力的な"
        "コンテンツ、差別表現、誤情報などは禁止されています。"
    )

    return "\n\n".join([concept, profile, content_section, hashtag_section, safety_section])


def main() -> None:
    """Main entry point for the Streamlit application."""
    st.set_page_config(page_title="TikTok運用プランナー", page_icon="🎵", layout="centered")
    st.title("TikTok運用プランナー")
    st.write(
        "TikTokアカウントのコンセプトと運用計画を作成するためのツールです。"
        "下記の情報を入力すると、最新のガイドラインに基づいた提案を生成します。"
    )

    # Input form
    with st.form(key="input_form"):
        niche = st.text_input("ニッチや業界 (例: 美容、グルメ、教育)")
        audience = st.text_input("ターゲットオーディエンス (例: 20代女性、起業家)")
        goals = st.text_input("目標 (例: ブランディング、認知度向上、販売促進)")
        content_types = st.multiselect(
            "興味のあるコンテンツ形式",
            options=["動画", "カルーセル", "テキスト", "ストーリー", "ライブ"],
            default=["動画"],
        )
        frequency = st.slider(
            "週当たりの投稿回数", min_value=1, max_value=14, value=3,
            help="1週間で何回投稿するか選んでください"
        )
        keywords = st.text_input("追加のキーワードや条件 (任意)")
        submit_button = st.form_submit_button(label="プランを生成")

    # Collect user inputs into a dictionary
    user_inputs: Dict[str, Any] = {
        "niche": niche.strip(),
        "audience": audience.strip(),
        "goals": goals.strip(),
        "content_types": content_types,
        "frequency": frequency,
        "keywords": keywords.strip(),
    }

    # Display guidelines in an expandable section
    with st.expander("プラットフォームガイドラインの要約"):
        st.markdown(
            "- **アカウント作成:** 正確な連絡先情報を提供し、利用規約に同意して"
            "一意の認証情報を維持します。ビジネスアカウントでは追加の"
            "検証手続きが必要です【136762664129441†L146-L160】。\n"
            "- **プロフィール設定:** 高品質な写真やロゴを使用し、名前欄には"
            "ニッチに関する言葉を含めます。ユーザー名は一貫性を保ち、"
            "バイオには自己紹介や提供価値を記載します【628802310394189†L284-L307】。\n"
            "- **動画:** TikTokでは最大10分（アップロードなら60分）の動画が可能で、"
            "60秒以上の動画はリーチと視聴時間が向上する傾向があります。"
            "デュエット、ステッチ、返信機能を活用し、トレンド音源を使用します【628802310394189†L346-L369】。\n"
            "- **カルーセル:** 最大35枚の画像を組み合わせたストーリーテリングが可能で、"
            "読みやすさとブランドの一貫性を保ちます【628802310394189†L396-L427】。\n"
            "- **テキスト投稿:** ステッカーや音楽、色付き背景で視覚的に魅力を持たせ、"
            "短く分かりやすい文章で伝えます【628802310394189†L429-L447】。\n"
            "- **ストーリー:** 24時間限定で舞台裏や限定情報を共有し、ファンとの交流を深めます【628802310394189†L450-L466】。\n"
            "- **ライブ:** 18歳以上かつフォロワー1,000人以上で利用でき、"
            "視聴者が多い時間帯を狙って配信します【628802310394189†L470-L481】。\n"
            "- **コンテンツカテゴリ:** ブランドストーリーテリング、教育的な内容、"
            "価値観に合ったエンターテインメントやユーザー生成コンテンツが推奨されます【136762664129441†L274-L292】。"
        )

    if submit_button:
        st.subheader("生成されたプラン")
        prompt = build_prompt(user_inputs)
        result = call_openai_api(prompt)
        if result:
            st.markdown(result)
        else:
            # Use fallback plan if API call fails or no API key provided
            fallback = generate_fallback_plan(user_inputs)
            st.markdown(fallback)


if __name__ == "__main__":
    main()

