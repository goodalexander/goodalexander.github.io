"""Build commentary/war-trade-deep-dive-crypto-update from the founder's X article (2026-11-08).

Text = the X article blocks (typos fixed, wording kept). Visuals = every exhibit from the site draft
plus the three images that only exist on X. Extra oil detail from the site draft is inserted under
the Trade Structuring list. Template (head, nav, footer, sources) is reused from the draft page.
"""
import html, json, re, sys
from pathlib import Path

D = Path("static/commentary/war-trade-deep-dive-crypto-update")
SRC = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "/tmp/ga_tweet.json"))["tweet"]["article"]
draft = Path("scripts/war_trade_draft.html").read_text()  # site draft as of 2026-11-08

blocks = SRC["content"]["blocks"]
E = html.escape

def q(s):  # straight quotes -> typographic, after escaping
    s = E(s, quote=False)
    s = re.sub(r'(^|[\s(\[“])"', r'\1“', s); s = s.replace('"', '”')
    s = re.sub(r"(^|[\s(\[])'", r"\1‘", s); s = s.replace("'", "’")
    return s

FIX = {
 1: [("I own Brent Crude futures (trad) and am short hyperliquid perpetual swaps", "I own Brent crude futures (trad) and am short Hyperliquid perpetual swaps")],
 2: [("Silver vs SP500", "silver vs the S&P 500")],
 4: [("with next catalyst being interview tonight / his near term addressing impeachment proceedings.", "with the next catalysts being the interview tonight and his near-term response to the impeachment proceedings.")],
 6: [("If you like these articles check out goodalexander . com and subscribe (always free) - will focus more on markets and less on ranting here on out. Will do my best to make brainrot videos to accompany these articles for differently abled followers",
      "If you like these articles, subscribe (always free). I will focus more on markets and less on ranting from here on out, and will do my best to make brainrot videos to accompany these articles for differently abled followers.")],
 8: [("per-war", "pre-war"), ("7m bbl/ of oil a day", "7m bbl of oil a day")],
 10: [("Middle East Clients", "Middle East clients"), ("worth paying attention to", "worth paying attention to.")],
 13: [("deprvigin", "depriving"), ("War Powers Rules", "War Powers rules"), ('"The war ends when I say it ends"', '"The war ends when I say it ends."')],
 14: [("Ukraine War negotiations in Abu Dhabi this week in Abu Dhabi (Nov 10-11)", "Ukraine war negotiations in Abu Dhabi this week (Nov 10-11)"),
      ("end around Nov 14 which would", "end around Nov 14, which would"), ("60 minutes", "60 Minutes")],
 15: [("congressional Testimony", "congressional testimony"), ("Chinese Spy", "Chinese spy")],
 16: [("as well as oil", "as well as oil.")],
 19: [("likely to Say?", "likely to say?")],
 21: [("over excited", "over-excited"), ("anti war", "anti-war"), ("Airstrikes hit Yemen market", "Airstrikes hit a Yemen market")],
 22: [("wind down the war in Iran\".", "wind down the war in Iran'.")],
 23: [("a far right Jew - has", "a far right Jew, has")],
 24: [("on Americans", "on Americans.")],
 27: [("anti semitic", "antisemitic"), ("calls him \"staunch supporter of Israel\"", "calls him a \"staunch supporter of Israel\".")],
 28: [("of him and Miller", "of him and Miller.")],
 29: [("Noting that Iranian operations", "He also noted that Iranian operations")],
 30: [("declare victory", "declare victory:")],
 33: [("\"it's not a war. Can't be a war when for five months nobody was hurt killed or anything else\"", "\"It's not a war. Can't be a war when for five months nobody was hurt, killed or anything else.\"")],
 34: [("Re stirkes and escalation:", "Re strikes and escalation:")],
 35: [("We do minor stirkes", "\"We do minor strikes\"")],
 38: [("\"Does Trump fire hegseth and de-escalate by replacing him with DeSantis or another moderate\"", "\"Does Trump fire Hegseth and de-escalate by replacing him with DeSantis or another moderate?\"")],
 40: [("Trump posted Hegseth Videos to Truth Social that was a war funding inspo video", "Trump posted a Hegseth video to Truth Social - a war funding inspo video.")],
 44: [("Timing wise. Hakeem Jeffries House Democratic leader told ABC he's a hard yes on impeaching hegseth.", "Timing-wise: Hakeem Jeffries, the House Democratic leader, told ABC he's a \"hard yes\" on impeaching Hegseth."),
      ("as early as mondays", "as early as Monday")],
 45: [("Kusher", "Kushner")],
 63: [("all or nothing", "all or nothing.")],
 79: [("Q4:", "Q3:"), ("Saudi/ UAE", "Saudi/UAE")],
 81: [("underrated", "underrated.")],
 87: [("Q5:", "Q4:")],
 102: [("too late", "too late:")],
 106: [("Q6:", "Q5:")],
 108: [("ruining markets", "ruining markets.")],
 116: [("desetruction", "destruction")],
 121: [("q7:", "Q6:")],
 127: [("a picture of", "a picture of:")],
 132: [("Q8:", "Q7:")],
 133: [("Netanyhu", "Netanyahu"), ("most erious and strategy threat", "most serious strategic threat")],
 136: [("Q9:", "Q8:")],
 137: [("rallied to 13.6% in the past week", "rallied to a 13.6% yield in the past week"), ("here's the timeline so far", "Here's the timeline so far:")],
 148: [("Q10:", "Q9:")],
 149: [("vote democrat", "vote Democrat")],
 151: [("shoe in", "shoo-in")],
 152: [("Q11:", "Q10:")],
 154: [("Trumps allies", "Trump's allies")],
 157: [("catalyst calendar.", "catalyst calendar for the short side.")],
 159: [("going for it.", "going for it:")],
 160: [("The only risk off asset.", "The only risk-off asset.")],
 161: [("In the meanwhile Family offices", "Meanwhile, family offices")],
 162: [("rolling oil futures", "rolling oil futures.")],
 164: [("Q12:", "Q11:")],
 166: [("standing only /well attended", "standing room only / well attended")],
 169: [("first)", "first):")],
}
for i, subs in FIX.items():
    for a, b in subs:
        assert a in blocks[i]["text"], (i, a)
        blocks[i]["text"] = blocks[i]["text"].replace(a, b)

n = 0
def fig(src, cap, alt=None, link=None):
    global n; n += 1
    img = f'<img src="img/{src}" alt="{E(alt or cap)}" loading="lazy">'
    if link: img = f'<a href="{link}" target="_blank" rel="noopener">{img}</a>'
    return f'<figure class="exhibit">{img}<figcaption><span class="label">Exhibit {n}</span>{q(cap)}</figcaption></figure>'

def xlink(url, label):
    return f'<p><a href="{url}" target="_blank" rel="noopener">{E(label)}</a></p>'

# X block index -> visual (our files; captions = founder's X captions where he wrote one)
ATOM = {
 9: lambda: fig("brent-lmt.jpg", "Market consensus rapidly shifted towards de-escalation with Brent Crude (orange) and Lockheed Martin dropping double digits. Since Oct 30: Brent -13%, Lockheed -11%"),
 11: lambda: fig("eurchf.jpg", "EURCHF continues to drop"),
 17: lambda: fig("calendar.jpg", "See the geopolitical calendar for this trade going into year end. ⚠ = tentative date"),
 18: lambda: fig("oil-calendar.jpg", "Oil has non-geopolitical catalysts worth monitoring, laid out above. Impact ratings are our assessment"),
 39: lambda: fig("01.jpg", "Markets pricing about even odds. Polymarket, Pete Hegseth out as Secretary of Defense by Dec 31: 68% the day after the midterms, 32% on Nov 7, 46% after Jeffries backed impeachment"),
 41: lambda: fig("hegseth-reel.jpg", "The Hegseth video Trump posted on Truth Social on Nov 7", link="https://truthsocial.com/@realDonaldTrump/117577381997659473"),
 43: lambda: fig("hegseth-trump-vance.jpg", "The image Hegseth chose - \"Trump leads the way\" - somewhat deliberately showing Vance", link="https://x.com/PeteHegseth/status/2119224692871749688"),
 47: lambda: fig("02.jpg", "Iran: who is in charge? The answer: a lot of hardened guys with dead predecessors"),
 64: lambda: fig("03.jpg", "Washington has only indicated one \"yes\" out of 5+ conditions. Lebanon is firmly outside of Washington's hands - it's Israel's call. Requires coordination that is very unlikely imo"),
 66: lambda: fig("iran-deal-odds.jpg", "Polymarket odds of a final US-Iran nuclear deal: 10% by Dec 31, 3% by Nov 30. Every earlier deadline, June through October, expired at zero"),
 78: lambda: fig("04.jpg", "Every ship broadcasting AIS in the Gulf on Nov 7, with the 32 attacks reported to UKMTO in the last 30 days. Visible crossings run 20-38 a day. The oil panel only counts tankers broadcasting their position, so it is a floor: Bloomberg's tanker tracking puts Saudi exports at 7 million barrels a day in October, near pre-war, with much of it shuttled out by Gulf producers or loaded on the Red Sea"),
 82: lambda: fig("05.jpg", "Who funds Kushner's fund, what it owns, and where those backers stand on Iran"),
 85: lambda: xlink("https://x.com/FLOTUS/status/2118819005159145692", "FLOTUS on X, Nov 6: the Oleshky ceasefire and \"humanitarian diplomacy\""),
 109: lambda: fig("scapegoat-headlines.jpg", "Trump has already anointed the scapegoat for markets"),
 112: lambda: fig("fuel-demand.jpg", "Since the war began Feb 28: retail gasoline +31% and jet fuel +83% vs 2025. Gasoline demand -0.2%, jet fuel demand -0.4% - barely budging (EIA weekly product supplied)"),
 113: lambda: fig("airlines.jpg", "Q3 2026 vs Q3 2025: jet fuel per gallon +60-63%, revenue +16-21%, traffic (revenue passenger miles) flat. Every carrier guides Q4 revenue up about 20%"),
 115: lambda: fig("macro.jpg", "US payrolls, unemployment, real GDP and retail sales since January 2025"),
 117: lambda: fig("q4-revisions.jpg", "Consumers are straight up eating fuel costs, with trips actually increasing modestly. Bloomberg consensus revenue for Q4 2026 vs reported Q4 2025, today vs Feb 27"),
 119: lambda: fig("travel-cruise.jpg", "Q3 2026 demand, year over year, from the earnings releases and calls"),
 120: lambda: fig("abnb-growth.jpg", "Airbnb Q3 shareholder letter: growth in bookings, nights and revenue accelerated through the war. Nights and seats +16% in Q3 vs +10% in Q2"),
 123: lambda: fig("majors.jpg", "Exxon and Chevron Q3 production fell year over year and US upstream capex is down 12% and 16% so far this year. Part of the production drop is lower contract entitlements at higher prices and Middle East outages"),
 125: lambda: fig("spr.jpg", "US Strategic Petroleum Reserve, million barrels: 415M before the war, 282M on Oct 30 (EIA weekly)"),
 150: lambda: xlink("https://x.com/FuentesUpdates/status/2118231048308044216", "Fuentes on JD Vance: \"You had something to say about the Iran War? Should have said something in February\""),
 153: lambda: "",  # Binance sheet moved to the crypto section
 155: lambda: fig("trade-valuation.jpg", "The short basket together has $8.2 trillion of market cap on $806bn of forward revenue, $187bn of net income and just $14bn of free cash flow. That is a 2.3% forward earnings yield and a 0.2% free cash flow yield. The S&P 500 earns 5.6% (3.7% in free cash flow), MSCI World 5.9% (3.9%) and the developed world outside the US 6.8% (5.4%)"),
 158: lambda: fig("trade-calendar.jpg", "Catalyst calendar for Apple, Tesla and SpaceX through year end. Company investor relations, filings and public sources"),
 163: lambda: fig("uso-cl1.jpg", "Ratio of USO to CL1. It's much harder to justify owning oil when it's oversupplied because storage becomes expensive (remember when oil went negative during covid - this is the opposite of that)"),
}

# Extra detail from the site draft, inserted after a given X block
def draft_p(start):
    i = draft.index(start); return draft[i:draft.index("</p>", i) + 4]

AFTER = {
 135: lambda: fig("pm-israel.jpg", "Polymarket priced escalation out after the US midterms: the chance of an Israel-Iran exchange by Nov 15 fell from about 45% to 14%, and to 29% by Nov 30. Eisenkot is now 68% to be the next prime minister, Netanyahu 22%"),
 137: lambda: fig("ukraine-bond.jpg", "Ukraine 4.5% 2036 dollar bond (Bloomberg YV463914): 61.74, yield 13.6%. Peaked near 71 in July, fell to about 55 in October, rallying into the Abu Dhabi talks"),
 151: lambda: fig("06.jpg", "Polymarket 2028 presidential election winner. Vance 19%, Ossoff 18% after jumping on the midterms"),
 162: lambda: "\n".join([
    "<h3>1. The only risk-off asset</h3>",
    draft_p("<p>Oil is also the least correlated asset to US stocks."),
    fig("trade-corr.jpg", "Correlation of weekly total returns with the S&P 500: five years vs since the war"),
    "<h3>2. An underweight inflation hedge</h3>",
    draft_p("<p>Elon Musk and Apple are part of the American exceptionalism trade"),
    fig("trade-flows.jpg", "Cumulative net inflows since January 2020: US index ETFs $1.14 trillion, international $331bn"),
    draft_p("<p>Passive indexing studies cover the worldwide equity risk premium"),
    draft_p("<p>The same goes for commodities."),
    fig("trade-alloc.jpg", "Allocations to fixed income vs commodities, total returns of commodities vs US bonds, and core PCE inflation vs the Fed's 2% target"),
    draft_p("<p>Long-term allocations aren&#x27;t short-term trade catalysts"),
    "<h3>3. Positive carry</h3>",
    fig("trade-carry.jpg", "Brent futures curve on Nov 6 vs Feb 27 (pre-war), and the front-month vs 12-months-out spread over 10 years. Rolling long Brent pays about 23% a year if prices hold"),
 ]),
 167: lambda: fig("binance-attacker.jpg", "Binance attacker: sales, swaps and remaining assets, Nov 8"),
}

out, lst = [], None
def close():
    global lst
    if lst: out.append(f"</{lst}>"); lst = None
for i, b in enumerate(blocks):
    t, txt = b["type"], b["text"].strip()
    if t == "atomic":
        close(); out.append(ATOM[i]()); continue
    if i == 6: continue  # subscribe CTA lives in the page's signup box
    if not txt or txt == "---": close(); continue
    if txt.startswith("https://gist.github.com/"):
        close(); out.append(f'<p><a href="{txt}" target="_blank" rel="noopener">{E(txt)}</a></p>'); continue
    body = q(txt)
    if i == 3: body = body.replace("TLDR:", "<strong>TLDR:</strong>", 1)
    if i == 42: body = body.replace("Hegseth posted the ending on X", 'Hegseth posted the ending on <a href="https://x.com/PeteHegseth/status/2119224692871749688" target="_blank" rel="noopener">X</a>', 1)
    if t in ("unordered-list-item", "ordered-list-item"):
        tag = "ul" if t[0] == "u" else "ol"
        if lst != tag: close(); out.append(f"<{tag}>"); lst = tag
        out.append(f"<li>{body}</li>")
    else:
        close()
        out.append(f"<h2>{body}</h2>" if t == "header-two" else f"<p>{body}</p>")
    if i in AFTER: close(); out.append(AFTER[i]())
close()
body_html = "\n".join(x for x in out if x)

# template from draft: everything up to note__body, sources onwards
head, rest = draft.split('<div class="note__body">', 1)
sources = rest[rest.index("<h2>Sources</h2>"):]
extra_src = ('<li>USO US Equity / CL1 Comdty ratio: Bloomberg</li>\n'
             '<li>FLOTUS on X, Nov 6<br><a href="https://x.com/FLOTUS/status/2118819005159145692" target="_blank" rel="noopener">https://x.com/FLOTUS/status/2118819005159145692</a></li>\n'
             '<li>Fuentes Updates on X, Nov 5<br><a href="https://x.com/FuentesUpdates/status/2118231048308044216" target="_blank" rel="noopener">https://x.com/FuentesUpdates/status/2118231048308044216</a></li>\n'
             '<li>Binance attacker sheet: Elliptic (theft, freezes), Bitquery (XRP swaps), Panoptic (swap routes); balances read Nov 8 17:58-18:08 UTC, prices CMC</li>\n')
sources = sources.replace('<ul class="sources">\n', '<ul class="sources">\n' + extra_src, 1)

TITLE = "War Trade Deep Dive + Crypto Update"
DEK = "I think Trump will strike Iran before January, in tandem with Israel, in a deeply unpopular move that will de-rate expensive stocks and drive flows into oil."
head = re.sub(r"<title>.*?</title>", f"<title>{E(TITLE)} · goodalexander</title>", head)
head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{E(DEK)}">', head)
head = head.replace('<meta property="og:title" content="goodalexander">', f'<meta property="og:title" content="{E(TITLE)}">')
head = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{E(DEK)}">', head)
head = head.replace('content="../../plates/hero-1600.jpg"', 'content="https://goodalexander.com/plates/iran-1600.jpg"')
head = re.sub(r'<time datetime="[^"]*">[^<]*</time>', '<time datetime="2026-11-08">8 Nov 2026</time>', head)
head = re.sub(r'<h1 class="note__title">.*?</h1>', f'<h1 class="note__title">{E(TITLE)}</h1>', head)
head = re.sub(r'<p class="note__dek">.*?</p>', f'<p class="note__dek">{q(DEK)}</p>', head)
sources = sources.replace('data-label="post-is-trump-going-to-re-escalate-iran"', 'data-label="post-war-trade-deep-dive-crypto-update"')

(D / "index.html").write_text(head + '<div class="note__body">\n' + body_html + "\n" + sources)
print("exhibits:", n)
