---
author: ["goodalexander"]
title: "Post Fiat Journey: Day 9 (Structure out of Chaos)"
date: 2025-06-04T11:21:29Z
draft: false
summary: "Capital Markets Stuff - Unstructed to Structured Data Conversion. Trustless Judgment"
categories: ["markets"]
tags: ["crypto"]
---
# Intro 

Going back to this quote from Bloomberg I probably mentioned previously - as it's very relevant to the Post Fiat Story

-----
Igor Tulchinsky made a fortune by outwitting human traders. Now he’s banking
on large language models to make his hedge fund even smarter.

It’s a cloudy March morning in Midtown Manhattan and Igor Tulchinsky is
explaining from behind his wooden desk, between sips of coffee and long pauses
to think, his latest algorithmic vision—the introduction of large language
models for his hedge fund WorldQuant. “The first thing that the LLM can do is
it can structure data and 80% of data that’s out there is unstructured,” says
Tulchinsky, dressed in all black, his piercing blue eyes gleaming with
excitement. “It’s like a free lunch.”
-----

Today I wanted to just dive into how I think about back end data stuff for AI trading agents.

Essentially - markets are a video game. But it doesn't seem like a video game. Until you convert it into structured data. Which is basically, summaries and standardized ways of looking at things. 

So the basic thing you do is:
1. Ingest all transcripts and plain English news
2. Create structured sampling methodologies that represent common ways people consumer information
3. Process these structured sampling methodologies with more powerful models to either
a. Simulate behavior of market participants and attempt to identify resulting contrarian trades or
b. Try and make a smarter model that extracts alpha directly
c. Some mix of both

But basically there's this huge data cleaning process. So rather than talking a lot I figured today I'd show. Here's the typical 180 pages of Structured market data we process every day with institutional clients. Email me at alex@agti.net if you want Bloomberg access to a chatbot that can interact with this or otherwise are interested in working together. AGTI is our client facing capital markets arm for deploying Post Fiat based blockchain solutions at institutions. AGTI = Our version of Ripple Labs, basically.

So yes. Here's an example of Structured Data. You might think of ways of how you might structure it differently, and indeed there is a combinatorial explosion of ways to do that.

Before I get into it I kind of want you to understand something:

The original idea for Post Fiat actually came from this. Because you can structure market data reliably, it actually allows you to make 'objective' statements about what a participant with a certain set of behaviors would do. Without emotion. Trading without emotion is a plus. But a network without human trust is a paradigm shift. I call this idea "trustless judgment" and it will be featured in our whitepaper (coming soon). 

But here goes on seeing how much stuff there is on a daily basis. And this is just in macro. But this is every day. And it's totally standardized. 

# GoodBrief (2025-06-05 21:00:09)

# USD Bullish

## Monetary Policy & Federal Reserve (Hawkish Stance)
*   Fed Chair Jerome Powell has emphasized a commitment to returning inflation to the 2% target, with former Fed staffers believing he is legacy-driven and unlikely to be renominated by President Trump, suggesting a hawkish resolve. A rate hike is considered "entirely in the realm of possibility" (David Wilcox) if inflation rises and consumer expectations increase.
*   Multiple Fed officials, including Bostic, indicated patience on rate cuts due to persistent inflation, wanting to see "a lot" more progress on prices, which is a hawkish stance. The FOMC minutes reflected agreement on a patient approach to rate adjustments amid heightened economic uncertainty.
*   Fed officials indicated that tariffs are likely to interrupt disinflation and cause a temporary rise in inflation, suggesting a need for a continued hawkish/cautious monetary policy stance. The Federal Reserve may delay anticipated rate cuts if inflation concerns from tariffs and a weaker dollar outweigh slowing economy concerns.
*   Fed's Beige Book reported firms expect costs and prices to rise at a faster rate, with plans to pass tariff-related costs to consumers, suggesting inflationary pressures that could keep the Fed hawkish. This was echoed by a New York Fed survey where 75% of companies raised prices due to tariffs.
*   Michelle Bowman, as a Fed governor, dissented against a large rate cut in September due to inflation being above target and has generally held a more hawkish stance on interest rates, which is supportive for the USD.
*   Dallas Fed President Lorie Logan said the Fed can remain patient and wait for data, with risks to inflation and unemployment appearing "fairly balanced," and emphasized ensuring tariff-driven price increases don't become persistent inflation.
*   Fed's Goolsbee stated rates can fall if trade policy uncertainty is resolved, implying that current uncertainty is a factor keeping rates firm.
*   SOFR options show demand for upside hedges in the December tenor, with new risk including 15k SFRZ5 96.25/96.75 1x2 call spreads and 8k SFRZ5 96.00/96.125/96.25 call flies bought, indicating expectations for higher rates.
*   Fed Governor Christopher Waller stated he would support "good news" rate cuts later this year if tariff levels are moderate (e.g., settles close to 10% effective rate) and inflation/unemployment are healthy, but also indicated willingness to look through near-term tariff effects on inflation if expectations remain anchored.
*   April's PCE inflation showed a modest uptick in prices of goods with heavy exposure to China, likely to keep FOMC members hawkish.
*   The Federal Reserve's Standing Repo Facility (SRF) will face a critical test post-debt ceiling resolution to control money-market rates as the Treasury increases bill issuance, with additional daily operations seen as a positive for funding markets. Treasury expected to rapidly increase cash balance via increased bill issuance after debt ceiling resolution, which will drain reserves from banking system.

## Fiscal Policy & Government Initiatives (Pro-Growth, Pro-Investment)
*   President Trump is pushing the Senate for swift passage of a multi-trillion dollar tax bill (passed by the House) by July 4th, with Senate Republican leaders intending to make temporary tax cuts permanent, potentially increasing the bill's deficit impact beyond $2.5 trillion. American tax cuts are looming.
*   Treasury Secretary Bessent stated President Trump "wants the US to become more of a manufacturing economy," with precision manufacturing as a key administration goal.
*   The Trump administration is reworking Chips Act deals to secure better terms and spur further domestic investment.
*   President Trump signed an executive order pausing enforcement of the Foreign Corrupt Practices Act, benefiting certain US companies like Pilgrim's Pride/JBS.
*   The Trump administration is moving to repeal Biden-era curbs on oil drilling in most of the National Petroleum Reserve-Alaska, which holds an estimated 8.7 billion barrels of recoverable oil, potentially quadrupling North Slope oil output.
*   President Donald Trump's push to accelerate construction of nuclear power plants is boosting the nuclear sector.
*   Retaliatory tax measures are planned against non-US individuals and corporations, potentially boosting US markets.
*   Oil companies that donated $1 million or more to Trump's inaugural secured tariff exemptions after meeting with Trump early in the administration.

## Trade Policy & Domestic Industry Support
*   President Trump raised steel and aluminum tariffs to 50% (from 25% for steel), effective June 4, 2025, strengthening US trade protection measures, with expectations that the US steel trade surplus with Mexico will increase in 2025.
*   American-made steel is reportedly unable to meet current strong domestic demand, and US aluminum producers are expected to see significantly increased profit margins and capacity expansion due to tariffs making imports costly.
*   US export controls are reportedly limiting China's advanced chip production, and the US is pursuing individual AI chip deals with countries (e.g., UAE) to control distribution and prevent access by Chinese firms, reinforcing US technological leadership. AI deals with the UAE are crafted to spur complementary US spending. The Commerce Department is enhancing export controls on semiconductors, replacing an AI diffusion rule with one allowing individual country negotiations.
*   Commerce Secretary Lutnick stated a US-India trade deal is expected in the "not-too-distant future," before a July 9 tariff deadline, with India pledging to buy more US weapons, oil, and gas (to reduce $127 billion bilateral trade imbalance from 2023) and both countries targeting $500 billion in bilateral trade by 2030.
*   A US federal appeals court temporarily blocked a ruling that threatened to overturn many of President Trump's tariffs, allowing them to remain in place during the appeal and maintaining the administration's trade policy stance.
*   US goods trade deficit shrank substantially in April as new tariffs weighed on imports - goods imports fell 20% to $276.1 billion while exports rose 3.4% to $188.5 billion.
*   Global aluminum demand is set to expand, with the US potentially outperforming due to new trade deals.
*   The Trump administration has told US companies to stop selling software services to firms in China, indicating stronger enforcement of technology export restrictions.
*   The US is considering allowing the UAE to buy over 1 million Nvidia chips, demonstrating US leverage in bilateral negotiations.

## Capital Inflows & Market Strength
*   Taiwan Semiconductor Manufacturing Co. (TSMC) increased its US investment commitment by an additional $100 billion (to $165 billion total) for its Arizona facilities without requiring more government funding. TSMC reaffirmed its commitment to spend $100 billion ramping up manufacturing in Arizona over the next half-decade, with CEO C.C. Wei noting productive discussions with President Trump.
*   Payments company Wise Plc plans to shift its primary listing from London to the US, citing the US as its biggest market opportunity (CEO: "the biggest market opportunity in the world for our products") and expecting increased investor access and potential inclusion in major US indices. Several other companies, collectively worth around $100 billion, have also moved listings to the US. Indivior Plc is also moving its main listing to New York from London.
*   Nine US companies have reached $1 trillion market capitalization or more, representing 34.1% of the S&P 500 index weight, indicating the strength of large US corporations.
*   Capital flight from mainland China due to economic struggles and crackdowns may be increasingly directed towards US assets. Mainland investors poured about HK$658 billion ($83.9 billion) into Hong Kong-listed stocks via cross-border trading link so far this year (though this is HK, it implies capital movement which could indirectly benefit USD if HK is a conduit or if it reflects broader risk aversion benefiting USD).
*   US investment-grade corporate debt yields have remained attractive (often above 5%), driving strong demand and tight new issue concessions, with stubborn inflation expected to support Treasury yields and overall credit allure. Buyers are reportedly confident the Trump administration would intervene if spreads widened significantly.
*   Trafigura (a major commodity trader) made a $3 billion strategic investment in Cogentrix Energy, a US-based gas power plant operator, signifying foreign investment in US energy infrastructure.
*   Kimberly-Clark Corp. is repatriating $3.4 billion from the sale of its international tissue businesses (majority stake in global Kleenex and tissue businesses outside North America) to a Brazilian company.
*   Sanofi (French pharmaceutical) is acquiring US-based Blueprint Medicines for $9.1 billion equity value, representing a cash inflow to a US company.
*   US hedge fund Saba Capital Management LP has built near-30% positions worth roughly £1 billion ($1.35 billion) in UK investment trusts, representing significant US capital deployment capability.
*   The Czech Republic will pay $627 million for an extended lease of Swedish Gripen jets until 2035, which will be utilized until US F-35s (scheduled for delivery from 2031) are operational, implying future defence-related capital flows towards the US.
*   Investment in subsea cable systems projected to reach $15.4 billion between 2024 and 2028 driven by data center construction boom and AI platform demand.
*   High-quality floating-rate notes (FRNs) offer additional yield at superior credit ratings compared to 1-5 year investment grade corporate bonds due to the inverted Treasury curve.
*   US 30-year TIPS yield is testing key resistance near 2023's peak, indicating rising real yield expectations. The TIPS yield bounce has accelerated, challenging major chart resistance levels, with a potential 11-bp rise to the high for the week ended June 15, 2007 if breached.

## Corporate Sector & Innovation
*   Nvidia's shares rallied significantly (more than 45% since April low, market value to $3.4 trillion), nearing status as the world's most valuable company. Major tech companies (Microsoft, Meta, Alphabet, Amazon) projecting combined capital expenditures of roughly $330 billion in 2026 (up 6% from estimated spending this year). Amazon plans aggressive data center expansion, and Elon Musk is raising $5 billion in debt for xAI Corp.
*   The US remains the global leader in AI development and is leveraging this for economic growth and deal-making.
*   Meta Platforms signed a 20-year contract to buy nuclear power from Constellation Energy's Clinton plant starting mid-2027 and is seeking proposals for new US reactors. Constellation is also reviving its Three Mile Island plant to sell output to Microsoft, reflecting significant US tech investment in domestic nuclear energy.
*   Robinhood Markets has been identified as a top candidate for S&P 500 inclusion with the highest potential among 10 companies analyzed.
*   Four pending M&A deals (Hess, Ansys, Juniper, Kellanova) are likely to complete in June, creating new S&P 500 slots for US entrants and reflecting active US capital markets.
*   JBS (a major food processing company) received approval to list on the New York Stock Exchange, indicating positive capital market activity.
*   Dollar General boosted its comparable sales forecast for 2026 (to as much as 2.5% from 2.2%) and Q1 EPS beat estimates, with the company expecting to mitigate a significant portion of potential tariff impacts.
*   Signet Jewelers raised its full-year earnings per share and sales guidance, with the CEO noting a "resilient consumer" and less than 10% of its inventory exposed to China tariffs.
*   The Agriculture Department moved to allow chicken processing plants to process more chickens, benefiting the US industry.
*   Joe Mansueto, founder of Morningstar, agreed to spend $650 million to build a new 22,000-seat soccer stadium in downtown Chicago.
*   Mission: Impossible – The Final Reckoning earned $25.2 million in China during opening weekend, becoming the top-performing US release in the country for 2025.

## Regulatory Environment & Financial Sector
*   Fed Vice Chair for Supervision Michelle Bowman is expected to support easing bank capital requirements, including changes to the supplementary leverage ratio (potentially reducing 5% SLR requirement) and rescinding stricter long-term debt rules for large lenders, potentially boosting the financial sector and Treasury market liquidity. Treasury Secretary Bessent is also hosting meetings to streamline oversight, with potential moves on easing capital rules this summer. Michelle Bowman confirmed as Fed Vice Chair for Supervision signals shift to lighter financial regulation.
*   The Federal Reserve lifted the $2 trillion asset cap on Wells Fargo, allowing the major US bank (fourth-largest) to expand its balance sheet, operations (corporate/investment banking, direct lending, credit cards, wealth management), and hiring.
*   The Trump administration is implementing major cuts to the Consumer Financial Protection Bureau's (CFPB) workforce and operations, including dismissing enforcement actions against major banks and freezing agency work, which could reduce regulatory burdens on financial institutions.
*   Eight US-based G-SIBs collectively have about $130 billion of surplus capital as a shield against potential tariff losses.
*   Trump administration secured $14 billion of extra investment over 14 months from Nippon Steel deal.

## Immigration Policy
*   The Trump administration's DOJ is pressuring California to end its transgender athlete policy, threatening to withhold federal funds. It has also invoked wartime law to bypass immigration rules for "alien enemies" and deported over 200 migrants to El Salvador.
*   The Trump administration announced a $1,000 payment program for undocumented immigrants who agree to leave the US voluntarily, which DHS claims saves on deportation costs.
*   Trump administration pushing Serbia and other Balkan nations to accept US deportees as part of broader strategy to find foreign governments willing to receive migrants.
*   Trump signed proclamation banning individuals from 12 countries from entering the US and used tariffs to pressure Mexico and Canada to do more to secure the border.

## Other
*   OPEC+ oil supply increases may offer relief to consumers and support central bank efforts against inflation, aligning with President Trump's desire for cheaper oil.
*   Euro volatility metrics suggest US data is the bigger near-term risk than ECB decisions, highlighting the focus on the US economy.

# USD Bearish

## Economic Weakness & Recession Risks
*   Weaker-than-expected US job creation (May ADP report only 37,000 jobs, weakest in over two years, vs 62k April and 110k expected; Bloomberg Economics forecasts soft May payrolls at 90k-96k vs 177k prior, 3-month average 153k) and service-sector activity gauges (contracted in May, ISM below 50) have curbed dollar demand due to speculation of Federal Reserve rate cuts as soon as September. Markets price higher odds of two Fed cuts by year-end (Oct/Dec), September move odds >90%.
*   FOMC minutes indicated a cautious policymaking approach amid elevated uncertainty, with staff viewing recession odds as "almost as likely as the baseline forecast." Tariffs were expected to increase unemployment.
*   US gross domestic product decreased at a 0.2% annualized pace in Q1 (revised down from 0.3% decline), with economists warning that damage to business/consumer confidence from Trump's tariff regime could already be done. Manufacturing shrank the most in five months in April.
*   Fed Beige Book consistently shows elevated uncertainty across all districts, leading to cautious business/household behavior and delayed hiring/investment. Nine of 12 Fed districts reported economic contraction or no growth in May. US economic activity declined slightly.
*   US job openings declined in April (modestly, forecast to fall to fewest since 2020), especially in discretionary services and manufacturing; layoffs increased, and the quits rate dropped, signaling a weakening labor market and difficulty finding new jobs. Latest jobless claims pointed to ongoing hiring weakness.
*   The OECD slashed its US economic growth forecast to 1.6% (from 2.8%), making the US among the hardest-hit globally by Trump's tariff policies, trade barriers, and uncertainty hitting confidence and investment. US inflation to move higher, likely delaying Fed easing until 2026.
*   University of Michigan consumer sentiment is at recession levels. American households felt gloomy in May.
*   US factory activity contracted in May (ISM Manufacturing expected to remain in contraction at 49-49.5), and a gauge of imports fell to a 16-year low as firms pulled back due to higher tariffs. Core durable goods orders declined sharply in April.
*   A Fed model from 2018 suggests each 1 percentage point tariff hike lowers US GDP by 0.14% and raises core PCE prices by 0.09%; current hikes (e.g., doubling steel/aluminum tariffs to 50% could affect 6% of US goods imports, add 1.1 ppt to average effective tariff rate) could mean a 1.6% GDP hit and nearly 1% price boost over 2-3 years, creating stagflation risks.
*   Mentions of job cuts in Russell 3000 earnings transcripts rose.
*   Home sales have retreated to negative on year-over-year basis due to renewed affordability pressure and declining consumer confidence. Demand for purchase loans has fallen to the lowest in more than a decade. Homebuilder confidence has declined, leading to slower housing starts.

## Trade Tensions & Negative Tariff Impacts
*   Uncertainty from President Donald Trump's trade war has shocked markets, with the Russell 2000 Index falling 5.9% YTD and small-cap firms seen as vulnerable. Trump's April 2 tariff announcements reportedly led to a "Sell America" trade response.
*   China's export controls on rare earths (licensing on seven types, including products containing them; review period 45 working days) and finished magnets, in response to US tariffs, threaten to disrupt US high-tech manufacturing and AI supply chain. Ford idled a factory due to shortages. USTR Jamieson Greer stated China is slow-walking critical mineral exports/compliance.
*   US restrictions on EDA software sales to China threaten to disrupt the AI supply chain concentrated in Taiwan and South Korea.
*   Deteriorating US-China trade relations are evident: President Trump frustrated with Xi Jinping, anticipated call unlikely soon, Geneva tariff truce under threat. Cracks emerging in US-China trade truce, with Treasury Secretary Scott Bessent stating talks have "stalled." US and China accused each other of reneging on recent trade deal/violating Geneva tariff agreement.
*   US tariffs have disrupted US-to-China LPG flows, causing Chinese importers to seek alternatives, indicating a loss of US export market share.
*   US service providers faced higher input prices due to tariffs, with costs being passed through but also expected to be absorbed via profit margins. Tariffs reported to be directly hitting US firms, causing prices to surge and orders to fall. Citigroup analysts stated tariffs have "mostly just functioned as a tax on consumers thus far."
*   The US Court of International Trade ruled President Trump's "reciprocal tariffs" unlawful and that many import taxes (estimated at $1.4 trillion over a decade by Tax Foundation) exceeded congressional authority (citing "major questions doctrine"), though decision paused by federal appeals court, creating policy uncertainty and sapping US leverage. Supreme Court review considered inevitable.
*   President Trump's erratic policy shifts, including doubling steel levies to 50% (affecting ~6% of US goods imports, adding ~1.1 ppt to avg. effective tariff rate), are creating uncertainty. Komatsu forecasted Trump's tariffs would depress its net income by 30% this year. General Electric Co. faces $500 million in residual cost challenges from Trump tariffs.
*   Fears of a US-led trade war sapping economic growth and energy demand have contributed to a fall in crude oil prices this year (down ~13%).
*   US tariffs caused a sales collapse for the Oregon-based subsidiary (Ripskirt Hawaii LLC) of a Canadian company (Giftcraft Ltd., which filed for bankruptcy).
*   Lower Chinese power costs (coal prices down 30% y/y, provincial power prices down 8-24%) are improving the competitiveness of Chinese exporters against US companies.
*   Trump's global tariffs will drag down growth and suppress inflation in Asia, giving regional policymakers room for easing, potentially leading to oversupply outside the US and making Asia Pacific the region with the weakest inflation globally (Bridgewater).
*   Average prices on Shein rose over 20% in early May due to tariffs (145% on Chinese imports, cancellation of de minimis), and sales for Shein and Temu fell ~16-19% (y-o-y for 28 days ended May 22). A court later ruled Trump's import taxes illegal in late May.
*   Construction companies warned that tariffs on steel and aluminum will increase costs. More than 80% of aluminum used in US is supplied via imports, while less than 20% of steel is. US does not have enough domestic capacity of either.
*   Washington is still a decade away from securing rare earths independently from Beijing. China produces almost 70% of world's metals crucial for critical technology.
*   Trump announced 100% tariff on movies made outside the US. Reports suggest Trump may add 20% tax on all imported goods and 25% tax on cars and car parts.

## Fiscal Concerns & Debt Burden
*   The House-passed multi-trillion dollar tax bill (extending Trump's tax cuts) is estimated to add $2.4 trillion (CBO) to $3.3 trillion to US budget deficits over a decade. Elon Musk publicly opposed the bill due to its fiscal impact. The 'Big Beautiful Bill' is expected to add trillions to the federal deficit.
*   Investors are reportedly demanding more compensation to hold long-dated US notes due to anxiety over the widening fiscal deficit and America's swelling budget gap/debt burden. Major firms like BlackRock (underweight/cautious), DoubleLine Capital (avoiding/shorting 30-year Treasuries, "buyers' strike"), Pimco, Deem Global (profited from shorting), and TCW Group reflect this caution. Strategists warn of "bond vigilantes" and potential "Liz Truss moment."
*   Moody's Ratings stripped the US of its last top-tier AAA credit score in mid-May.
*   US overall debt levels are forecast by the Congressional Budget Office to top $50 trillion by the mid-2030s. US debt-to-GDP ratio already equals the size of the economy and will likely rise to 118% in 2035.
*   US Treasuries experienced their first monthly loss of the year in May, with the 30-year yield rising for a third consecutive month. May's 30-year auction saw weak interest. Lackluster longer-dated bond sales raise questions about investor willingness to lend.
*   Analysts estimate the US government cash balance will be "uncomfortably low" by mid-August, nearing zero around Aug. 22, with August Treasury bills pricing in a small risk of technical default amid debt limit stress. The Treasury Department estimates running out of borrowing authority in August or September.
*   Section 899 "revenge tax" in the federal tax and spending bill could tax foreign investment from certain countries (those with "discriminatory" tax policies), potentially slowing capital inflows. Allianz SE's CIO predicts a 5% dollar plunge if implemented, acting as a "capital control." JCT estimates it would lower annual US tax revenues by $12.9 billion in 2033-34. Foreign investors hold ~$31 trillion in US long-term securities.
*   The Trump administration is reportedly renting houses near Mar-a-Lago at above-market rates (e.g., one lease increased over fivefold to $1.44 million/year; combined $3.3 million/year for three houses vs $546,783/year for two previously), signifying increased government spending.
*   JPMorgan CEO Jamie Dimon delivered a dire warning for markets, predicting a crisis unless the U.S. takes steps to address its spiraling national debt.

## Monetary Policy Uncertainty & Dovish Pressures
*   Fed official Lisa Cook noted tariffs could stoke inflation but also weaken employment. Multiple Fed officials (Jefferson, Kugler, Barr, Waller) warned tariff-related supply-chain disruptions could lead to lower growth and higher unemployment, while boosting inflation.
*   President Trump pressed Fed Chair Powell to lower interest rates, potentially undermining Fed independence. Rumors of Jerome Powell's resignation and Trump administration plans to lower interest rates are circulating (though Polymarket odds low).
*   Kashkari (Minneapolis Fed) noted tariff uncertainty is causing a pullback in US business investment and that some businesses are considering layoffs amid a softer labor market.
*   Fed Governor Goolsbee acknowledged that trade policy uncertainty could delay Fed rate cuts.
*   Markets expect ~50bps of Fed rate cuts by December. Any labor market cracks add to easing bets.
*   Asset allocators are moving bearish on US inflation, implying Fed may give up on fighting inflation, which is bad for the dollar.

## Market Sentiment & Capital Outflows/De-Dollarization
*   The US dollar index slumped 8.4% in the first five months of the year, its worst start on record (Dow Jones Market Data), trading near its lowest since spring 2022. The Bloomberg Dollar Spot Index declined almost 7% in 2025 to May 29, and near 4.5% BBDXY decline since April 2. A gauge of the dollar approached its lowest since 2023.
*   President Trump's sweeping trade tariffs and erratic policy shifts have reportedly shaken investor faith in US Treasuries and the dollar as global safe-haven assets, spurring appetite for alternatives. The dollar's share of foreign currency reserves has been falling for years (UBS). ECB President Lagarde noted "uncertainty about the cornerstone of the system: the dominant role of the US dollar."
*   Morgan Stanley forecasts the US Dollar Index will fall ~9% to 91 by next year; Goldman Sachs models suggest the dollar is ~15% overvalued. JPMorgan reinforced its negative dollar view.
*   Wealthy Americans are increasingly applying for New Zealand's golden visa program (biggest group), representing capital and talent flight from the US due to desires for a "safe haven."
*   Global funds are reportedly seeking to reduce US exposure amid fears of Trump's policies' economic impact and potential recession, driving capital from dollar assets. UniSuper (Australian pension fund) ramping up cash holdings.
*   RBC BlueBay Asset Management and Goldman Sachs consider the US dollar attractive as a funding currency for emerging-market carry trades due to prospects of further dollar weakness.
*   Inflows into Chinese government bonds (49.3 billion yuan in April, largest in 16 months) suggest investors are seeking alternative safe havens amid rising skepticism about US Treasury credibility, potentially ignoring short-term macro drivers for a longer-term de-dollarization trend.
*   The US stock market (S&P 500) shows significant underperformance (2% total return in 2025 through June 4; up only 0.5% YTD in another mention) compared to the MSCI World Ex-US Index (almost 20% advance; 12% jump for MSCI ACWI ex-US), suggesting reduced attractiveness. S&P 500 ranks 73rd among 92 indexes.
*   US stock market capitalization reaching 2x GDP is seen as a potential peak signal, similar to 1929 and 1989 Japan. US stock market cap vs. GDP/rest of world is at a ~century high, suggesting reversion risk.
*   JPMorgan strategists prefer international stocks over the US due to stretched valuations and expect a "stagflationary episode" threatening S&P 500.
*   Trump's tariff approach has "undermined the strength of the dollar," and its reserve currency status is "certainly damaged" (Picton Mahoney CEO). The "era of US exceptionalism is also under pressure."
*   The dollar "frown" theory and doubts about its reserve-currency standing reinforce a bearish outlook.
*   US investors acquiring stakes in British football club Wrexham AFC (e.g., Allyn family's ~15% stake) represents capital outflow from the US.
*   Overseas investors have become net US MBS sellers due to tariff and currency uncertainty.
*   Global asset allocators show highest proportion expecting USD to fall over next year in survey's 10-year history.
*   Volatility in US markets has led to speculation about a "sell America" narrative.
*   One large Taiwanese insurer has already begun building a small position in top-rated Australian and UK corporate bonds to diversify from US dollar assets.

## Regulatory & Political Uncertainty
*   Regulatory paralysis at the CFTC, with the agency down to two members as of June 1, risks neglect of critical US financial markets (over $600 trillion derivatives market) and threatens oversight, preventing advancement of Trump's crypto policy.
*   Senate GOP plans to eliminate mandatory funding for the Consumer Financial Protection Bureau and restrict Fed employee pay as part of a larger tax and spending bill, potentially increasing fiscal outlays and regulatory uncertainty. A new 150-page Republican guide aims to weaken federal agencies.
*   President Trump's executive action preventing foreign nationals from studying at Harvard University and targeting Columbia University's accreditation may restrict talent inflow and damage the reputation of US higher education.
*   Quantum's VanLoh warned that the Trump administration's policies are creating "a lot of chaos" for the US energy industry and the overall economy, potentially leading to more inflation.
*   The Bureau of Labor Statistics is experiencing staffing shortages (Trump admin proposed 8% budget/staffing cuts), hampering its ability to conduct price surveys accurately and undermining data reliability for policymaking.
*   US health-care policy under Trump, including executive orders with potential for substantive changes in Big Pharma, is making dealmaking "incredibly hard" for investors, with a broader rotation in dealmaking moving away from the US.
*   Mixed signals from Washington on US-China trade and investment (e.g., Ambassador Perdue's message vs. Trump's accusations) are causing concern and delaying reshoring decisions. "Chopping and changing on tariffs" has been "very disruptive."
*   Trump administration has issued stop-work orders for foreign aid programs including PEPFAR ($440 million annually cut), with Congressional authorization expired.
*   IDP Education warns international student environment in the US is increasingly negative, contributing to expected 30% decline in student placements.
*   Texas Senate Bill 25, if signed, would require warning labels on foods with over 40 ingredients "not recommended for human consumption" by other countries, affecting major US food companies and potentially leading to nationwide adoption, legal risks, and consumer confusion/higher costs.
*   Labor Department is now officially neutral on whether companies should allow cryptocurrency in 401(k) plans.

## Corporate & Sector Specific Weakness
*   US corporate profits face pressure from tariffs, potential austerity, and accelerating deflation from China.
*   Apple's AI services rollout in China with Alibaba is stalled by Chinese regulators due to geopolitical uncertainties.
*   US-based cruise operators like Norwegian Cruise Line (84-85% US guests), face risks from yield deceleration amid global trade tensions and observed softer US travel demand (e.g., for 3Q Europe inventory).
*   Sunnova Energy International Inc. filed for Chapter 11 bankruptcy, citing high interest rates, lower state incentives, and uncertainty from Trump Administration's threats to solar incentives (IRA). SunPower Corp. also filed for bankruptcy in August 2024. System installations fell ~20% in the US last year. The Trump administration has withdrawn support from clean energy, S&P Global Clean Energy Transition Index lost ~40% in three years.
*   Broadcom expected to post record AI sales, but companies like Campbell's (outlook threatened by steel/aluminum tariffs) and Lululemon (margins hit by tariffs/currency) are expected to report profits eroded by higher costs from Trump tariffs. Brown-Forman likely saw flat sales.
*   Citigroup is cutting 3,500 technology jobs in China (Shanghai and Dalian); plans for a Chinese securities firm hampered by US/Chinese regulations.
*   Chicago faces $29 billion in debt and over $37 billion in unfunded pension liabilities, consuming nearly half its tax revenue, and has the lowest credit rating of large US peers. Illinois is seen as vulnerable. Chicago's economic/job growth lags.
*   Tesla Inc.'s new-vehicle registrations in France fell 67% to 721 cars in May (lowest since July 2022); sales down 47% YTD in France. Tesla leasing surged 77% YoY (Experian), Cybertruck values plunged 43%.
*   Rivian faces potential removal of IRA tax credit under President Trump, has a $38,000 EBITDA loss per vehicle (2025), may need $3 billion more funding through 2027, high default risk.
*   Wells Fargo agreed to sell its rail equipment leasing business assets ($4.4 billion book value) to Brookfield Infrastructure Partners and GATX.
*   Most big US banks have underperformed the sector in 2025 on elevated debt issuance and increased recession risk from President Trump's tariffs.
*   Energy sector (S&P 500 Energy Index) forming bearish chart pattern, April outflows for energy ETF biggest in 10 years.

## Inflationary Pressures & Consumer Impact (Stagflation Risks)
*   Credit deterioration is evident with net charge-offs up sharply (7x higher than 2022 lows), and subprime auto loan delinquencies are 1.6x the long-term average. 60-day auto delinquencies at 17-year high. Auto loan rates are over 200 bps above the long-term trend. 17% of auto loans have monthly payments of $1,000 or more (pre-tariff increases). New car monthly payments $748.
*   Trump's tax bill would result in higher electricity prices due to reduced renewable energy capacity (BNEF: additions down 10% by 2035, wind down 35%) and increased utility capital costs, leading to more CO2 emissions.
*   Extreme heat is projected to inflict ~$200 billion in annual losses in the US by 2030, doubling by 2050. ~89 million people face elevated power supply shortfall risks this summer. Power prices may rise with heat due to low coal stockpiles. Droughts threaten crop yields. US natural gas could jump 30%+.
*   US business optimism plummeted. NY Fed survey: manufacturers reported tariffed goods costs increased ~20% (service firms ~15%) in past six months. Almost half reported decreased bottom lines. Some small reductions in workers. Nearly a quarter of services firms reduced investments.
*   University of Michigan survey: median expected 5-10 year inflation 4.2% in May; 2/3rds mentioned tariffs; 20% expect 15%+ inflation.
*   President Trump admitted his policies might cause economic "pain," linked to high import tariffs, international tension, and trade wars.

## Geopolitical & International Factors
*   Chinese social media platform Xiaohongshu (RedNote) is gaining traction as a TikTok alternative in the US, with its valuation surging, partly funded by US institutions.
*   China has imposed export licensing on key rare earths, added US defense companies to an unreliable entities list, halted some US agricultural imports, and launched anti-dumping probes against US goods.
*   The US is seen as alienating allies with its economic and defense policy overhaul. Trump's tariff policies criticized by allies (e.g., Australian PM calls steel/aluminum tariff hike "economic self harm").
*   Ongoing weakness in China's property market (e.g., Gemdale Properties stress, falling residential sales) could reduce Chinese demand for dollar-denominated assets.
*   US-China tensions are escalating, benefiting Hong Kong as "China's most important window to international finance." Trump policies may drive human capital to Hong Kong. CATL's $5.2 billion non-US investor listing is an example.
*   Chinese EV manufacturers are offering extended-range EVs (over 1,000 miles), potentially reducing global dependence on US automotive technology.
*   South Korea's potential new leadership (Lee Jae-myung) may adopt foreign policy less anchored to the US, cautious about swift trade deals.
*   Tariff discussions (Trump demanding 5% NATO defense spending, unreliable US security alliance) highlight policy uncertainty.
*   Trump warned Putin he has two weeks to prove he wants peace in Ukraine, or US will respond differently, threatening massive tariffs (25-50%) and cutting off Russian oil.

# EUR Bullish

## EU Integration & Policy Initiatives
*   European leaders are actively weighing development of the region's capital markets to help fund major shifts including adoption of new technology, climate change adaptation, and security improvements.
*   Former ECB President Mario Draghi and others have proposed a large expansion of the bloc's markets watchdog to advance European market development.
*   Germany's BaFin president Mark Branson expressed openness to joint oversight of clearing houses across Europe, indicating potential progress toward further centralization of financial supervision in the EU.
*   BlackRock's Hildebrand says there has never been a better time for the EU to create a safe and liquid government bond market to rival US Treasuries, spurred by Donald Trump's trade tariffs creating appetite for alternatives to US assets.
*   The EU's push for military independence and defense spending needs may unify efforts toward creating a common safe asset; the EU's €150 billion defense fund has received preliminary approval.
*   The EU and UK are working to link their carbon trading systems, which would benefit both regions' industrial sectors.

## Economic Resilience & Growth Prospects
*   The Eurozone economy grew more than expected in Q1 as businesses rushed to fill orders, attempting to front-run US tariffs.
*   German manufacturing orders unexpectedly rose in April, despite fears that US tariffs would hit demand for German goods.
*   The Euro area's private sector grew slightly in May, showing more resilience than initially estimated.
*   The German government is planning additional fiscal stimulus, including a package of corporate tax breaks totaling 46 billion euros to spur investment, alongside stepping up defense and public infrastructure spending.
*   German Chancellor Merz pushed through constitutional reform to allow perhaps as much as €1 trillion of new borrowing for infrastructure and removed constitutional borrowing restrictions on defense spending.
*   Germany's spending plans have underpinned rotation into domestic assets, contributing to a brighter economic outlook.
*   European Central Bank credit provision provided a slightly larger economic boost in April according to monthly data.

## Investment & Capital Inflows
*   Higher-quality European companies are in demand as US private equity managers seek deals with minimal exposure to US policy gyrations; KKR has deployed about $10 billion since April, much aimed at European assets.
*   Volkswagen is investing up to $5.8 billion into Rivian through a joint venture, providing Rivian with higher-margined revenue streams from software solutions.
*   Sanofi (French) is acquiring US-based Blueprint Medicines for $9.1 billion.
*   BioNTech (German) will receive up to $11.1 billion from Bristol-Myers Squibb for a cancer drug licensing deal.
*   Emirati funds Asas Capital and Mada Capital are ready to offer approximately $1.2 billion for Unicredit's Russian subsidiary, allowing Unicredit to exit its Russian operations.
*   Pandox and Eiendomsspar consortium made a non-binding proposal to acquire Irish hotel operator Dalata for ~€1.3 billion (€6.05 per share).
*   EQT Real Estate acquired a five-building logistics portfolio totaling approximately 148,000 square meters across three locations in southern France.
*   Jim Zelter of Apollo Global Management stated Germany is a leader and "It's a palpable change that we want to be a part of," indicating positive investor sentiment.
*   BlackRock is targeting a hiring drive and tie-ups with digital investment platforms in Europe to boost individual investors' access to private-markets products, cutting minimum investment levels to €10,000.
*   Advent managing partner John Maldonado states that dealmaking in European healthcare can be robust, with a broader rotation in dealmaking away from the US benefiting Europe.

## Trade & Geopolitical Factors
*   China is tilting its attention toward Europe for deeper trade ties, with Europe's trade chief Maros Sefcovic meeting Chinese Commerce Minister Wang Wentao in anticipation of an EU-China summit.
*   Commerce Minister Wang Wentao met top European Union trade officials as both sides step up engagement, with Beijing mulling orders for hundreds of Airbus aircraft as soon as next month during a scheduled visit of senior European leaders.
*   The Trump administration's trade policies are making batteries produced outside of China "more relevant," benefiting European businesses seeking suppliers closer to home (friend-shoring/on-shoring).
*   The EU is set to curb Chinese medical device manufacturers' access to public procurement contracts, asserting its International Procurement Instrument to promote reciprocity.
*   Europe and the Philippines will set up a new "security and defense dialogue," reflecting the EU strengthening ties with Asian nations to build "economic alliances."

## Inflation & Monetary Policy (Cautiously Bullish Aspects)
*   Euro-area HICP inflation fell to 1.9% in May (from 2.2% in April), meeting the ECB's 2% target. Core inflation declined significantly to 2.3% (from 2.7% in April), and services inflation decelerated to 3.2% (from 4.0%). This is viewed as bullish from a "target achieved" and stability perspective.
*   The ECB's wage growth data shows compensation per employee falling to 2.4% y/y in Q1 2025 from 4.1% in Q4 2024, supporting the view that inflation is under control.
*   ECB Governing Council member Fabio Panetta stated disinflation "is now close to completion," signaling a potential pause in rate cuts after June; economists also expect the ECB to take a break from rate cuts in July.
*   Money markets price only a one-in-four chance of another ECB cut in July after an expected June reduction, with Nordea analysts expecting the June cut to be the last in the cycle.
*   Joe Nellis, economic adviser at MHA, praised ECB President Lagarde's policymaking for setting foundations for economic growth and putting the inflation issue to bed.

## Corporate & Other Positive Factors
*   BASF (German) is kicking off a €6 billion sale of its coatings business.
*   Wizz Air reported net income of EU225.8 million, beating analyst estimates, with revenue and passenger numbers growing y/y and forecasting capacity growth of about +20% for 2026.
*   The European Commission approved a new room-temperature stable tablet formulation of Evrysdi for Roche.
*   Romania's assets are recovering following a centrist runoff victory in its presidential election, with the government having built a comfortable financing reserve.
*   Uncertainty surrounding US economic policies, combined with optimism about the EU's resilience and institutional stability, is viewed positively for the Eurozone.

# EUR Bearish

## ECB Monetary Policy Easing
*   The European Central Bank (ECB) is expected to cut interest rates by 25 basis points in June, potentially for the eighth consecutive time. Many analysts forecast further cuts in September, with the policy rate potentially reaching 1.50%-1.75% by year-end or Q1 2026. A baseline scenario calls for an additional 25bp cut in September, bringing the deposit rate to 1.75%.
*   The ECB is anticipated to retain a dovish tone, keeping the door open for further easing, with its Governing Council becoming more dovish according to the ECBspeak Index.
*   Eurozone headline inflation slowed to 1.9% in May and core inflation to 2.3%, remaining below the ECB's target. Forecasts suggest inflation will remain subdued (e.g., Bloomberg Economics: 1.9% for 2025, 1.5% for 2026, 1.6% for 2027, below ECB projections), supporting further ECB easing.
*   Negotiated wage growth in the Eurozone decelerated sharply to 2.4% y/y in Q1 2025 from 4.1% in Q4 2024, reinforcing expectations for ECB easing.
*   The disinflationary impact of US tariffs and a potential wave of Chinese goods redirected to the EU (possibly trimming 0.4 percentage points from inflation annually for a couple of years) are expected to add to price moderation and support ECB easing.

## Trade Tensions & Export Weakness
*   Bloomberg Economics vessel-based tracker signals a sharp decline in euro-area exports to countries outside the monetary union since early April, attributed to new US tariffs.
*   Germany faces substantial disruption, with its effective US tariff rate potentially jumping to 13.1% from 1.4%, risking a 0.7% GDP reduction. The current 25% US levy on motor vehicles could wipe out up to 40% of German car exports to the US.
*   France faces a 9% effective US tariff rate, potentially cutting 0.2 percentage points of GDP growth in 2025.
*   Italy's exports to the US declined in April, and its effective tariff rate on exports is up by more than 9 percentage points, potentially shaving approximately 0.4 percentage points off Italy's real GDP growth over 2025-26.
*   The US delayed the 50% EU tariff deadline to July 9 from June 1, but escalating tensions, persistent uncertainty, and threats of a tit-for-tat trade fight remain. Most EU goods currently subject to a 10% US tariff could jump to 50%.
*   Concerns exist that "Section 899" of a US tax bill could negatively impact European companies with significant US operations, potentially revising Stoxx 600 earnings down by 1-5%, as European stocks derive roughly 25% of revenues from the US.
*   France has pledged to lead a charge to obstruct ratification of the EU-Mercosur trade deal.

## Economic Slowdown & Negative Indicators
*   German industry has seen job cuts accelerate (losing ~10,000 posts a month), and unemployment jumped by the most in almost three years in May. German manufacturing has been declining steadily since late 2017, and the overall German economy has shrunk for the past two years.
*   May Eurozone PMIs are on the verge of contraction as tariff fears take a toll, and activity measures are disappointing.
*   Italy's manufacturing PMI fell to 49.2 in May, marking the 14th consecutive month of contraction.
*   German April Factory Orders are estimated to decline by -1.5% MoM (note: this is an estimate; an actual rise was reported separately). The May HCOB Germany Construction PMI remained in contraction at 45.1. April Eurozone PPI is also estimated to decline.
*   China's manufacturing activity fell to its lowest level in more than two years, negatively impacting European mining shares.

## Geopolitical & Domestic Political Risks
*   Domestic political challenges pose risks:
    *   EU skeptic Karol Nawrocki's presidential victory in Poland signals potential policy gridlock and skepticism toward EU integration, prioritizing national sovereignty.
    *   The Dutch ruling coalition collapsed after the far-right Freedom Party quit, likely triggering a snap election.
    *   Hungary faces rule-of-law concerns (e.g., its anti-LGBTQ+ law infringes EU bloc rules according to the European Court of Justice Advocate General) and EU fund suspensions.
    *   Slovenia's central bank governor position has been vacant for almost five months due to political disagreements, meaning the country lacks voting representation on the ECB's Governing Council.
    *   Slovak Prime Minister Robert Fico will not support the reappointment of Peter Kazimir as head of Slovakia's central bank following a bribery conviction.
*   ECB President Christine Lagarde has reportedly been courted for a top job at the World Economic Forum, raising speculation about a premature exit.
*   Romania has the widest budget deficit among EU member states, according to the European Commission.
*   NATO defense ministers are likely to commit to increasing military spending, and German Chancellor Merz flagged support for a higher target, implying a significant fiscal burden for member states.

## Energy Security & Supply Chain Pressures
*   Major Norwegian gas supply disruptions are affecting northwest Europe through July, with multiple simultaneous outages creating supply constraints and raising European natural gas prices (which rose as much as 2.5% due to disruptions).
*   Germany's Uniper SE stated its Breitbrunn gas storage facility might not reach the 80% fullness target pre-winter. Several European gas storage facilities remain unusually empty two months into the official stockpiling season, with Germany lagging behind peers in refilling gas inventories and one of western Europe's largest storage sites remaining stubbornly empty.
*   The EU faces potential production disruptions from China's export controls on rare earth metals and finished magnets, with only ~25% of European license requests granted. European automakers like Mercedes-Benz and BMW are in talks with suppliers to prevent shortages, with reports of production halts and plant shutdowns.
*   EU trade chief Maros Sefcovic raised concerns with China over these export restrictions. China has vowed action against the EU's planned procurement curb on Chinese medical devices.
*   Extreme heat waves, droughts, and wildfire conditions in Europe threaten to suppress wind generation and disrupt trade routes like the Rhine River.

## Corporate & Other Negative Factors
*   Mercedes-Benz Group AG announced plans to move production of another model to Alabama from Germany. Major European steel producers face layoffs and potential plant closures due to tariffs.
*   Wizz Air shares fell sharply after disappointing cost guidance; the company faces ongoing cost pressures, reduced fleet growth forecasts, and grounded aircraft due to engine issues.
*   Management at Norwegian Cruise Line observed softer demand in April for unsold 3Q inventory in Europe, with yield deceleration amid global trade conflict remaining a risk for European cruise operations.
*   An ECB review found banks faced challenges in determining overall exposures to private markets, with supervisor Claudia Buch calling for a regulatory response to related risks.
*   The Nord Stream 2 pipeline operator must pay off small creditors by September, indicating continued financial distress for the project.
*   Delivery Hero SE agreed to pay €329 million to settle an EU probe into collusion with Glovo over carving up takeout delivery markets.
*   Nordic Capital is delaying Noba Bank Group AB's IPO launch to H2 2025, citing market volatility in European markets.
*   Apple filed an appeal against the European Commission's Digital Markets Act interoperability requirements, arguing they stifle innovation and create costs.

# JPY Bullish

## Monetary Policy & Inflation
*   **Strong Inflation & BOJ Hawkish Stance:**
    *   Tokyo's core CPI inflation in May showed a sharper-than-expected pickup (to 3.6% YoY from 3.4%; core-core to 3.3% from 3.1%), beating consensus (3.5%), strengthening Bank of Japan's (BOJ) confidence in its 2% price target and supporting forecasts for a 25 basis point rate hike at the July meeting (Bloomberg Economics).
    *   Japan's inflation has been running well above the 2% target, with recent CPI prints consistently exceeding consensus forecasts; price pressures are intensifying across a broad range of categories, and upside surprises are no longer explained by yen weakness alone, indicating strong domestic inflation pressures. BOJ's favored histogram charts show a clear shift in the distribution of price changes toward the inflationary side, with a second hump forming above the 2% target.
    *   Services inflation is accelerating (e.g., Tokyo services to 2.2% from 2.0%), indicating companies are passing on higher labor costs to consumers in areas like hotel charges, dining-out costs (accelerated to 5.9% from 5.7%), and entertainment. Processed food prices rose 4.7% YoY; food prices (ex-fresh produce) accelerated to 6.9% from 6.4% in May.
    *   BOJ Governor Kazuo Ueda has stated his intention to keep hiking rates if the economic outlook is realized, encouraged by inflation surprises and strong wage data. The BOJ is expected to consider a rate hike in July when its quarterly report provides a chance to reassess the policy path.
    *   The BOJ is normalizing monetary policy, exemplified by its ongoing reduction of government bond purchases (¥400 billion per quarter, aiming for ¥2.9 trillion monthly by early 2026). Governor Ueda stated many market participants view continued tapering as appropriate, and the BOJ is considering continuing these reductions beyond April next year, signaling further quantitative tightening. Markets anticipate gradual QT beyond April 2026.
    *   UBS Asset Management recommends the BOJ raise rates at its July meeting and normalize its QE portfolio duration, which would make long JGBs appealing and improve market function.
*   **Strong Wage Growth & Tight Labor Market:**
    *   Base salaries are showing strong growth, with April's figure rising 2.2% YoY (accelerating from 1.4% revised), and wages for full-time workers climbing 2.5%, staying at/above 2% for a 20th consecutive month.
    *   Annual "shunto" wage negotiations resulted in employer pledges for pay increases over 5% for a second straight year, with some workers seeing their largest pay increases in over three decades. Record 2024 shunto pay talks with even steeper wage hikes set for 2025 are contributing to wage pass-through inflation.
    *   Japan's labor market remains tight, with the unemployment rate below 3% for over four years (2.5% in April) and the job-to-applicant ratio at 1.26. BOJ research shows wage gains will be more fully reflected in payroll stubs from around June.
    *   The labor force is still growing due to rising participation from women, the elderly, and foreign workers.

## Capital Flows & Investment
*   **Inflows & Repatriation Potential:**
    *   Foreign capital is flowing into Japanese equities; global investors were net buyers of cash Japanese equities for eight consecutive weeks (longest streak since June 2023), with total net purchases reaching ¥2.86 trillion since early April (foreigners bought ¥285 billion in shares during week to May 23). New funds like Nezu Engagement Fund are targeting Japanese companies, and Bridgewater's Asia ex-China fund invests in Japanese assets.
    *   Japanese investors may reconsider hedge ratios on their "vast pile of largely unhedged foreign assets" (currently near record lows), creating potential for JPY-supportive repatriation flows. Ministry of Finance figures showed Japanese investors were net sellers of foreign bonds during the week ended May 30.
    *   The Japanese government plans to raise its incoming foreign direct investment (FDI) target to ¥120 trillion ($840 billion) by 2030 (from ¥100 trillion), with a longer-term objective of ¥150 trillion. It will support FDI in key industries like AI and semiconductors and consider revising tax systems.
    *   High government yields in Japan are reportedly diverting foreign demand from US credit toward JGBs.
*   **Corporate Investment & Shareholder Returns:**
    *   Japanese firms have announced a record number of share buybacks this year, aiming to boost shareholder returns. Corporate profits have hit record highs.
    *   Capital expenditure is increasing: Q1 goods ex-software +1.8% YoY (accelerating from 1.3%); including software +6.4% YoY.
    *   Nippon Steel plans a significant domestic investment of ¥869 billion ($6 billion) in Japanese steel mills to expand electric arc furnace capacity, with the government providing up to 29% of the funding.
    *   TSMC is expanding its base in southwest Japan for Tokyo's chipmaking project (though its second factory faces delays - see Bearish).

## Market Sentiment & JGBs
*   **Underpriced Rate Hike Risks & JGB Demand:**
    *   Market pricing for BOJ rate hikes is considered exceptionally low by some analysts (e.g., Deutsche Bank), with fewer than 20bps priced by year-end for an economy with nominal GDP growth around 4%, suggesting underpriced rate hike risks. Traders see around a 70% chance of borrowing costs rising by year-end (OIS).
    *   Recent Japanese government bond (JGB) auctions have shown instances of strong demand, such as a 10-year sale where the bid-to-cover ratio increased to 3.66 (highest in 14 months) from 2.54. A 30-year sale also showed better-than-expected demand (Note: contrast with bearish points on other long-dated auctions).
    *   Credit Agricole's recent ¥85 billion Samurai bond issuance saw strong demand from Japanese financial institutions, particularly for its floating-rate tranche, indicating investor preference for yen assets that benefit from rising rates and renewed institutional interest.

## Economic Resilience & Trade
*   **Resilient Production & Exports:**
    *   Japan's export sector is showing resilience despite US tariffs, partly due to prior production shifts to the US since 1980s trade friction and a focus on high-value-added models. The weaker yen (around 144.86/USD in April) provides a profit cushion for manufacturers.
    *   Industrial production fell only 0.9% m/m in April (vs. -1.4% forecast). Manufacturing surveys indicate companies plan to increase output (e.g., 5.2% in May from April, with strength in manufacturing equipment and cars).
*   **Positive Trade Developments:**
    *   There are growing expectations for a trade deal between Japan and the US, with Japan's top trade negotiator Ryosei Akazawa noting progress in ministerial-level negotiations and considering returning to the US for further talks, with expectations of a deal as early as this month.
    *   China has agreed to resume some seafood imports from Japan (value of ¥83.6 billion in 2022), resolving a major diplomatic spat. Premier Li Qiang also pledged to expand business ties with a Japanese trade delegation.

## Corporate & Financial Sector Activity
*   **M&A and Restructuring:**
    *   There's an increase in M&A activity and corporate restructuring, partly due to 2023 government guidelines effectively condoning hostile takeovers as legitimate corporate strategy. Major banks (MUFG, SMBC, Mizuho) are increasingly advising on such bids (e.g., Taiwan's Yageo Corp. offer for Shibaura Electronics).
    *   Japan's three biggest banking groups are considering jointly operating ATMs to reduce costs and improve operational efficiency to better compete with global peers.
    *   Trump approved Nippon Steel's $14 billion investment in U.S. Steel, including $2.2 billion in Pittsburgh's Mon Valley plant (Note: the investment itself is a capital outflow, see Bearish).

## Other Bullish Factors
*   Bloomberg Economics' Japan Inflation Surprise Index has steadily climbed through 2025.
*   Japan remains at the global frontier in advanced manufacturing.

# JPY Bearish

## Trade Tensions & Economic Impact
*   **US Tariff Risks & Economic Drag:**
    *   Uncertainty over US tariffs is a key factor in the BOJ's cautious stance and makes it difficult to deliver clear policy signals. Japan faces a "reciprocal" tariff rate of 10% from the US, with a threat of an increase to 24% if a deal is not reached, a 25% levy on cars, and US tariffs on Japanese steel and aluminum recently doubled to 50%.
    *   These tariffs could put 0.3% of Japan's GDP at risk in 2025. The biggest carmakers (e.g., Toyota Motor) could face a hit of over $19 billion.
    *   Japanese companies face risks of earnings forecast downgrades due to tariff impacts. Hitachi Construction Machinery, for example, did not factor US tariffs into its net profit forecast due to uncertainty. Trump's tariffs could squeeze corporate profits, limiting firms' ability to offer generous compensation, and the BOJ noted the pace of nominal wage growth might slow due to declining corporate profits. Companies that disclosed tariff impacts are expected to outperform those that haven't.
    *   A slowdown in overseas economies is likely to weigh on Japan's exports and production, potentially causing business investment to decelerate, according to the BOJ. Japan’s manufacturing activity contracted recently due to drops in new export orders and production.

## Monetary Policy & Inflation Concerns
*   **BOJ Dovish Caution & Skepticism on Hikes:**
    *   BOJ Governor Kazuo Ueda has expressed caution about "forcefully" raising policy rates, stating the BOJ will only hike after confirming its economic outlook is realized and not just to make room for future rate cuts. This dovish tone has led some market participants to believe it will be difficult for the BOJ to raise rates, also citing concerns about the larger-than-anticipated impact of US tariffs on the economy.
    *   Many economists and market participants expect the BOJ to hold its policy rate unchanged (e.g., Barclays until January) due to trade uncertainties, waiting for the overall tariff picture to take shape before assessing impacts on corporate earnings and wage negotiations.
    *   There are divergent views within the BOJ on the pace of bond purchase reductions, with some members suggesting slowing the pace or even temporarily suspending cutbacks. A former BOJ board member suggested the BOJ is likely to halt bond purchase reductions next fiscal year due to concerns over rising JGB yields.
*   **Weak Real Wages & Consumption:**
    *   Despite nominal wage growth, real wages continue to decline (e.g., -1.8% YoY in April, falling more than the forecast 1.6% decline; real wages posted gains in only four of the past four years), eroding purchasing power and potentially damping consumer spending.
    *   Base salary growth (2.5% in April) remains below the 3% level flagged by Governor Ueda as consistent with the 2% inflation target. Some analysts see recent wage pickup driven by technical effects rather than underlying strength.

## Economic Weakness & Domestic Concerns
*   **Economic Contraction & Stagnant Growth:**
    *   Japan's economy shrank in the first three months of the year, mainly due to weaker trade and sluggish consumption, with concerns it could slip into a technical recession. Stagnant disposable income is damping consumer sentiment, and GDP growth is generally stuck in low gear.
    *   Business investment remains defensive, with capital expenditure stagnant and firms not seeing much upside in growth expectations according to Cabinet Office surveys.
*   **Rising Living Costs & Social Impact:**
    *   Rising rice prices (doubled in the past year in some regions, with some seeing prices 2.5 times higher) are contributing to inflation pressures that households are struggling with, creating public anger ahead of the summer election.
    *   New legislation requiring employers to protect workers from extreme heat will impose additional costs on businesses. Japan experienced 30 workplace deaths and approximately 1,200 injuries in 2024 due to high temperatures, and worker productivity is known to drop significantly in extreme heat. Japan is expected to have a warmer-than-normal summer.

## Fiscal & Debt Sustainability
*   **High Debt & Fiscal Concerns:**
    *   Japan's debt-to-GDP ratio remains the worst among developed economies, and the government has delayed its primary budget surplus target to fiscal 2025 or 2026. Rising debt servicing costs (about a quarter of the budget) are a concern for the Ministry of Finance.
*   **Weak JGB Demand & Market Stress:**
    *   Weak demand has been evident in several JGB auctions, particularly for longer maturities. For example, a 20-year JGB auction saw its bid-to-cover ratio fall to the lowest level in more than a decade, and a 30-year bond auction showed a bid-to-cover ratio of 2.92, indicating weak demand. Weak auctions have pushed yields on super-long debt to record highs for "bad reasons" (fiscal/demand concerns, not growth), and confidence in longer-maturity JGBs is crumbling.
    *   The bond market is signaling that current government borrowing plans may not be sustainable as the BOJ reduces its footprint. There's general caution among investors about longer-maturity JGBs. The MoF reportedly surveyed market participants on issuance, suggesting borrowing strategy concerns, and is urging more domestic JGB buying.
    *   BlackRock finds Japanese long-dated debt unattractive.
    *   There is a structural decline in demand for long-dated JGBs from domestic life insurers and pension funds due to demographic shifts (shorter liability duration needs). UBS recommends the MoF stop issuing bonds over 30 years.
    *   The BOJ has set aside the maximum provision for losses on its bond transactions, indicating potential stress or expected losses on its holdings.

## Capital Outflows & Investment Setbacks
*   **Significant Capital Outflows:**
    *   Nippon Steel's $14.1 billion acquisition of US Steel (representing a 142% premium) signifies a substantial capital outflow and may require costly debt/equity issuance, potentially straining the company. Japan's domestic steel industry is shrinking.
    *   Denso is in talks to buy a Temasek-backed seed maker for $500 million, another example of capital outflow.
*   **FDI Project Delays:**
    *   TSMC is delaying construction of its second factory in Kumamoto Prefecture due to local traffic infrastructure problems, an indefinite setback for a key foreign investment project with no specific timeline provided for the delay.

## Political & Governance Risks
*   **Political Instability:**
    *   Political instability is a concern, with PM Ishiba's approval ratings hanging just above the 30% mark, his ruling coalition 13 seats short of a majority, and expectations of losing control of the upper house, potentially leading to a minority government.
*   **Banking Sector Governance:**
    *   The Financial Services Agency launched an onsite inspection of Iwaki Shinkumi Bank over fabricated loans totaling nearly ¥25 billion over two decades, highlighting governance issues in the banking sector.

## Other Bearish Factors
*   Suzuki Motor Corp. halted production of its Swift model due to rare earth supply issues.
*   Ultra-low yielding yen is still used as a funding currency for carry trades, which can put downward pressure on JPY.
*   Leveraged funds reduced their bullish yen bets, underscoring uncertainty over the Japanese currency's outlook.

# GBP Bullish

## Monetary Policy & Inflation Outlook
*   UK firms still expect to increase pay by 3.7% over the next year, well above the level considered compatible with the 2% inflation target, and BOE rate-setter Catherine Mann highlighted lingering pressures in goods and services prices, suggesting inflationary persistence.
*   Two-year inflation breakeven rates have climbed about 75 basis points since the BOE started loosening policy, reaching 3.70%, suggesting retail-price inflation is not expected to return to BOE target levels soon; annual retail-price inflation measured 4.5% in April, the highest in over a year.
*   Markets are only fully pricing in one more BOE rate cut this year after the central bank was more hawkish than expected at their last meeting; some rate-setters who backed a 25 basis point cut last month said they were close to holding policy steady.
*   DMP 1 Year CPI Expectations rose to 3.2% in May from 3.1% prior according to the S&P Global UK Construction PMI survey.
*   OECD report states inflation will "linger" this year due to higher import prices and robust wage growth in 2025, implying persistent inflationary pressures.
*   Morgan Stanley notes the UK's "high carry" and "low trade tension risks" as supportive factors for the pound.

## Economic Activity & Business Confidence
*   Lloyds' gauge of business confidence rose to a nine-month high in May, recovering to levels last seen soon after Labour took power.
*   Confidence among UK directors (IoD Economic Confidence Index) jumped to -35 in May from -51 in April, the highest since August 2024, driven by better revenue and investment expectations and positive responses to trade deals with the US and EU.
*   UK house prices unexpectedly rose by 0.5% month-on-month in May after seasonal adjustments, significantly above the consensus view for no growth, with prices 3.5% higher than a year earlier, according to Nationwide Building Society.
*   Britain's property market saw its busiest month in over three years in May, with home sales rising 6% according to Rightmove, driven by lower mortgage costs and defying expectations for a slowdown.
*   S&P Global's UK manufacturing PMI rose to 46.4 in May from 45.4 in April (a three-month high and above flash estimates); export orders rebounded from April's post-pandemic low, and indices for output and new orders showed rises.
*   Unemployment remains low and earnings are rising at a healthy pace even after accounting for inflation, according to Nationwide's chief economist; household balance sheets are strong.
*   Consumers took on £1.6 billion in unsecured debt in April, above forecasts, with borrowing on credit cards suggesting a jump in retail sales; a record £14 billion flowed into Individual Savings Accounts.

## Trade, Investment & Capital Flows
*   A US-UK "economic prosperity deal" reduced Britain's effective tariff rate on exports to the US to close to 8% from 11% and diminished the risk of additional 25% tariffs on pharmaceuticals and semiconductors.
*   47% of UK CFOs stated tariffs were not an important source of uncertainty in May, nearly double the proportion from April; over 70% of UK firms do not expect any impact on sales, investment, or prices from tariffs over the next year.
*   The listing of Valterra on the London Stock Exchange is a welcome development amid a drought of IPOs; Cobalt Holdings Plc, iForex Financial Trading Holdings Ltd., and Greece's Metlen Energy & Metals SA are also considering London listings, potentially boosting the City's appeal.
*   One large Taiwanese insurer has begun building a small position in top-rated UK corporate bonds to diversify from US dollar-denominated assets, indicating capital inflow.
*   A 2063 gilt offering was oversubscribed 3.51x, with bids totaling £4.9 billion, indicating strong demand for UK long-term debt.
*   HSBC UK Bank plc has mandated 9 major banks for a 5-year EUR benchmark Covered Bond transaction expected to be rated Aaa/AAA, indicating strong institutional confidence in UK banking sector creditworthiness.
*   Wrexham AFC is considering selling a stake at a £350 million ($475 million) valuation, up from a £2 million purchase price in 2021, with club revenue increasing to more than £26 million, potentially indicating investor interest in UK assets.
*   The UK government fully divested its NatWest stake, returning the bank to full private ownership after nearly 17 years, representing government asset monetization.
*   British negotiators reached an outline agreement with the US to limit tariffs for the UK, alongside deals with the EU and India; Trump spared the UK from doubled tariffs on steel and aluminum.
*   GBP/USD monthly fear-greed indicator stands at most bullish level since August 2021.

## Energy & Infrastructure
*   Centrica signed a £20 billion ($27.1 billion) agreement with Norway's Equinor to buy 5 billion cubic meters of gas per year until 2035, providing energy security for 5 million British homes and the UK; the deal allows for future replacement of natural gas with hydrogen, supporting the energy transition.
*   The UK and Norway are bolstering cooperation on clean energy projects, including carbon capture, storage, and offshore wind, with Energy Secretary Ed Miliband signing a green industrial partnership in Oslo in May.
*   The UK government estimates that aligning carbon markets with the EU would help industry save £800 million ($1.1 billion) in carbon taxes by 2030, and both are working towards linking their carbon trading systems.
*   Government announced a strategic defense review spending increase from 2.3% to 2.5% of GDP starting April 2027, with plans to build up to 12 new attack submarines creating 30,000 jobs.
*   Government announced a £15 billion investment in the nuclear warhead program and plans to build up to 12 submarines as part of the AUKUS partnership.

# GBP Bearish

## Monetary Policy & Easing Inflationary Pressures
*   BOE Governor Bailey stated "the rate path remains downward" and the BOE will continue cutting rates. BOE rate-setter Dhingra voted for a larger rate reduction, arguing for quick support for the economy amid weak consumption and a loosening labor market. BOE Deputy Governor Sarah Breeden signaled continued quarterly rate cuts and believes the UK labor market is loosening, with disinflation waves continuing.
*   The UK inflation rate was overstated by 0.1 percentage point in April due to a data error (ONS error on vehicle excise duty), meaning actual inflation was closer to the 3.3% consensus; this lower figure reduces pressure on the Bank of England to maintain a hawkish stance, with markets pricing in one more rate cut this year.
*   UK Decision Maker Panel year-ahead inflation expectations fell to 3.0% in May from 3.1% in April, and three-month year-ahead output prices fell to 3.7% from 3.9%, suggesting easing price pressures. Input price inflation in manufacturing also cooled to a five-month low.
*   BOE Governor Bailey said the central bank would need to "act more aggressively" with rate cuts if there's a threat of undershooting the 2% inflation target, and noted the labor market has "loosened somewhat." Expected cooling in pay growth is "intact."
*   A trader bought 25,000 SFIM6 96.80/96.90 call spreads targeting BOE lowering interest rates to 3% by June 2026 (125bps of easing from current levels); swaps imply around 59bps of easing by mid-next year.
*   The two-year gilt yield is only 18 basis points below the Sonia overnight rate, indicating limited scope for deep BOE rate cuts; traders price only a 55% chance of a BOE rate cut in August and a cumulative 50 basis points reduction by February next year.
*   BOE's Catherine Mann warned that QT bond sales risk stunting the economy by holding up long-dated yields and cannot be perfectly offset by Bank Rate cuts. UK gilt yields are also being driven by US spillovers, creating volatility. The BOE's QT program adds to market fragility.
*   BOE MPC is currently "reducing restrictiveness," signaling ongoing monetary easing according to rate-setter Catherine Mann.
*   Indeed UK wage data showed deceleration in April, and if reflected in ONS data, could boost rate-cut hopes.
*   Further UK interest rate cuts will hinge on whether wage growth slows as expected, according to Governor Bailey; BOE officials cited global economic uncertainty as a backdrop.
*   Bank of England policymakers noted difficulty deciphering labour market strength due to ONS methodology transition issues.
*   The BOE is considering relaxing capital buffers and mortgage lending restrictions to promote growth, suggesting economic weakness.

## Fiscal Concerns & Government Policy
*   Chancellor Rachel Reeves' fiscal headroom is under £10bn ("wafer-thin by historic standards"); NIESR warned this narrow headroom harms UK business confidence more than global trade uncertainty. The IMF and OECD also expressed concerns, urging bolstering of fiscal buffers.
*   UK defense spending demands pose a £350 billion fiscal risk for PM Starmer; raising defense spending linearly to 5% of GDP by 2032 from a 2.5% baseline would add just under 9 percentage points to the debt-to-GDP ratio. This includes a £15 billion investment in the nuclear warhead program, plans for up to 12 new submarines, purchasing 7,000 long-range missiles, and building six new munitions factories.
*   Analysts predict tax hikes of over £10bn in the Autumn budget to meet fiscal targets; the Treasury faces a potential £50bn bill by the end of parliament from quantitative tightening losses according to Office for Budget Responsibility projections. If the BOE scraps active gilt sales, Barclays analysts predict a £5.9bn hit to chancellor's spending.
*   Prime Minister Starmer's proposed visa curbs to reduce migration could cost the Treasury about £9 billion in tax revenue by 2029-30, making it tougher for Chancellor Rachel Reeves to balance the Autumn Budget; net migration has more than halved from its mid-2023 peak.
*   Chancellor Rachel Reeves was forced to back down on cutting spending on the £13 billion warm homes programme and the winter fuel payments cut for pensioners was walked back by the PM, indicating fiscal indiscipline or policy instability. There are rumors she is being lined up for a job change.
*   PM Starmer has no clear timeline for his 3% GDP defense spending "ambition," leading to criticism about funding. The Institute of Fiscal Studies expects "chunky tax increases." The Labour government is struggling for popularity, and Chancellor Reeves faces pressure over fiscal rules.
*   The IMF warned that any new UK spending, including watering down welfare cuts, must be offset by savings or tax hikes.
*   UK government borrowing costs are rising amid pressure to unwind attempts to moderate public sector spending, and there are questions about debt sustainability. Public sector productivity remains "woeful."
*   UK nuclear deterrent submarines (Vanguard class) are aging and require urgent, costly replacement. The Astute class submarines experienced significant struggles, cost overruns, and delays.
*   Analysts fear insufficient investor appetite to absorb high supply of government debt, predicting the Bank's sales will slow.
*   Former BoE Chief Economist Andy Haldane called Chancellor Reeves' performance "disappointing," citing "rookie errors" that undermined economic credibility and insufficient action on growth.

## Economic Weakness & Growth Outlook
*   The OECD downgraded UK growth forecasts to 1.3% this year (from 1.4%) and noted "weakening" UK economic momentum. Substantial debt payments will weigh on state finances.
*   The UK construction PMI recorded 47.9 in May, indicating a fifth consecutive month of decline; construction payrolls shrank at the sharpest rate since December 2010 (excluding pandemic). Housing was the weakest sub-sector. (Note: A separate S&P Global UK Construction PMI showed an improvement to 47.3 in May from 46.6 prior, but still in contraction).
*   UK mortgage approvals fell to 60,463 in April, the lowest level since February 2024, and net mortgage lending turned negative at £-0.8 billion, indicating weak housing market activity.
*   BOE rate-setter Swati Dhingra advocated for faster rate cuts, citing continued weakness in consumer spending, firm investment, and downside risks to inflation and growth. Dhingra also stated Brexit has left the UK economically weaker.

## Market Structure, Capital Outflows & Corporate Issues
*   Fintech Wise is switching its main listing to the US from London, citing trading liquidity issues. Cobalt Holdings scrapped its $230 million London listing. This is part of a trend where companies representing about $100 billion in market capitalization have moved primary listings away from London recently due to low valuations and weak liquidity. Indivior Plc also plans to cancel its secondary London listing.
*   At least 10% of the UK's wealthy non-dom population (an estimated 26,000) left in 2024 following tighter tax rules, potentially leading to a net cost to the Treasury if the exodus is large.
*   KKR & Co. pulled out of a rescue deal for Thames Water, which has a debt pile of nearly £20 billion and risks special administration. Ofwat has been criticized for its handling of the crisis.
*   UK investment trusts face ongoing pressure from activist campaigns, with some agreeing to asset sales or liquidation, potentially leading to capital outflows. These trusts often trade at a discount due to high costs and mediocre performance.
*   BlackRock finds UK long-dated debt unattractive, according to its strategists, suggesting negative sentiment.
*   UK 30-year gilt yields have risen, and UK sovereign bonds are lagging US Treasuries and German bonds, suggesting a UK-specific risk premium.
*   Wizz Air forecast a disappointingly slow recovery from engine issues, with problems remaining until 2027.

## Regulatory & Geopolitical Risks
*   BOE Governor Bailey warned interest rate cuts are "more uncertain" and "unpredictable" due to trade wars (Donald Trump mentioned).
*   Six senior Bank of England staff members resigned from climate and nature risk supervision roles, citing neglect of these issues and an underprepared UK financial sector.
*   Standard Chartered CEO Bill Winters described UK bank regulators as "too intrusive" and "too costly," creating a disadvantage for traditional UK banks compared to private credit firms and offering poor return on investment.
*   The UK government is threatening to sue Roman Abramovich over £2.34 billion in frozen assets, indicating legal uncertainty and a potential deterrent to foreign investment due to regulatory complexity.
*   The British Toy and Hobby Association found 85% of tested toys from third-party sellers on 11 marketplaces were non-compliant with EU/UK safety standards. The Labour government is reviewing its de minimis policy due to fears of goods dumping.
*   The UK announced plans to pause free-trade talks with Israel and impose sanctions, potentially impacting trade relations.
*   Heightened unpredictability in the UK with further restrictions on student immigration expected.
*   Governor Bailey warned that removing bank ring-fencing rules would likely reduce UK lending to SMEs and households, negatively impacting the economy.

# CHF Bullish

## Strong Economic Performance & Outlook
*   Q1 2025 real GDP grew a strong 0.5% q/q (revised up to an adjusted 0.8%), accelerating to 2.0% y/y, the fastest pace in two years and exceeding SNB forecasts (1.0-1.5% for the year), potentially reducing the need for deep rate cuts.
*   Exports of goods (excluding valuables) surged 5.0% q/q and 13.2% y/y in Q1 2025, with exports to the US rising sharply.
*   The services sector showed broad-based growth, with the PMI rising to 56.3 in May from 52.4 in April, and domestic demand developed positively in Q1.
*   Construction investment remained strong, growing 0.8% q/q and 2.9% y/y in Q1 2025.
*   April retail sales rose 1.3% y/y in real terms, with non-food retail sales up 2.2% y/y.

## Favorable Trade Developments & SNB Stance
*   The US has assured Switzerland that tariffs will remain at their current 10% level, not increase to 31%, with negotiations extended past July 9; discussions are underway for a UK-style trade deal with "relatively concrete ideas" on the table.
*   SNB President Martin Schlegel stated the central bank "doesn't like negative rates," suggesting a high bar for their reintroduction.
*   An SNB official (Tschudin) observed that periods of sub-zero inflation in Switzerland typically coincide with franc appreciation.

## Safe Haven Appeal & Market Sentiment
*   The Swiss franc has gained approximately 10% against the US dollar since the beginning of the year, with market observers noting its strength amid market uncertainty related to US tariff policy, indicative of safe-haven demand.
*   Morgan Stanley listed the Swiss franc among potential major beneficiaries of a broader US dollar decline.

## Positive Corporate Developments
*   Jefferies upgraded UBS to buy (from hold), citing a potential turning point on capital and an earnings inflection supporting ROTE expansion to 15% by 2027; UBS shares rose as much as 4.1% on the news.
*   Burckhardt Compression delivered significant margin progress, strong cash flow, robust orders (+2.4% y/y), sales of CHF1.10 billion (meeting estimates), and a dividend per share of CHF18 (vs. estimate CHF16.96).
*   Lindt & Spruengli demonstrated ability to pass on higher costs and gain market share, with successful product launches; shares have risen 28% year-to-date.
*   Novartis's Pluvicto showed significant benefit in a Phase 3 trial for prostate cancer, with FDA submission planned for the second half of the year.
*   Sandoz launched two interchangeable biosimilars in the US market (WYOST and Jubbonti), expanding pharmaceutical exports.
*   Roche received EU approval for a new Evrysdi formulation.
*   Holcim is completing a 100% spin-off of Amrize, which secured $3.4 billion in debt financing.

## Geopolitical Stance
*   Switzerland extended Russia sanctions in line with the EU, adding 17 persons, 58 organizations, and 189 ships to the sanctions list; its tally of frozen Russian assets reached $8.4 billion.

# CHF Bearish

## Deflationary Pressures & SNB Easing Expectations
*   Swiss headline inflation fell to -0.1% y/y in May (from 0% in April), the first negative reading since March 2021, driven by energy and rents. Core inflation also slowed to 0.5% y/y (from 0.6% in April, below expectations of 0.6%).
*   The SNB is widely expected to cut its policy rate by 25 basis points to 0.00% on June 19, with the door open for another cut in September; a return to negative interest rates is considered possible if inflation remains weak or continues to surprise to the downside.
*   SNB Chairman Martin Schlegel acknowledged that monthly inflation could be negative and that negative interest rates are an option, with the SNB seen as tolerating short-term negative inflation.
*   The strength of the Swiss franc is contributing to deflationary pressures by making imports cheaper (imported goods prices -2.4% y/y in May; imports make up 23% of the CPI basket), increasing pressure on the SNB to ease policy.
*   The increasing possibility of further easing at the European Central Bank is seen as supportive of SNB rate cut expectations.
*   Swiss prices, measured by the EU's harmonized index, dropped 0.2% while Eurozone inflation remained elevated, potentially widening interest rate differentials to the detriment of the CHF.

## Economic & Trade Headwinds
*   The manufacturing PMI fell sharply to 42.1 in May (from 45.8 in April), its lowest since December 2023, significantly missing economist estimates of 48.0 and remaining well into contractionary territory (below 50 since early 2023), signaling a potential slump.
*   The US is expected to add Switzerland to its "Monitoring List" for trade and currency practices, potentially limiting SNB's scope for FX intervention (SNB may face stronger US pushback if it intervenes to weaken the franc) and increasing bets on rate cuts (potentially 50bp).
*   US tariffs are expected to negatively impact the Swiss economy, potentially shaving 0.2 percentage points off GDP in 2025 (final impact depends on whether the pharmaceutical sector is included). Swiss investment has reportedly stalled since the April tariff announcement.
*   Goldman Sachs considers the Swiss franc an attractive funding currency for carry trades, implying expectations of weakness or low yield appeal for shorting.
*   The Swiss public budget is expected to be in deficit in 2025 unless consolidation measures are implemented.

## Financial Sector Concerns
*   UBS faces potential new regulations requiring as much as $20-27 billion in extra capital (Swiss government to publish consultation, analysts estimate $20-27B, UBS itself $25B), which could pressure returns and lead UBS to explore moving its HQ or rethinking its Americas operations.
*   Julius Baer's new strategy was deemed "underwhelming" by analysts, with the bank booking a CHF 130 million loan-loss charge, setting weaker efficiency targets, scrapping profitability targets, and its share buyback remaining on hold amid a FINMA review; shares declined, and regulators ordered a CHF 4.4 million handover due to alleged money-laundering control failings.
*   The Greensill Capital collapse continues to cast a shadow, with UBS inheriting multiple legal headaches from Credit Suisse related to the $10 billion in frozen funds and investor losses.

## Corporate Headwinds & Negative Events
*   Barry Callebaut shares have fallen 30% due to a lack of pricing power amid high cocoa costs, order pauses from customers waiting for cocoa prices to come down, and a cut sales outlook.
*   Meyer Burger had its shares suspended after missing its annual report deadline (for 2024), with its German units filing for insolvency, US production halted due to lack of funding, and its share price collapsing.
*   Swiss Re was downgraded to "underperform" from neutral by BNP Paribas Exane, with a price target of 130 Swiss francs implying a 10% decrease.
*   A large share sale in Avolta (CHF 180 million) by Taobao China Holding at CHF43.46 per share created significant selling pressure on CHF-denominated assets, with Avolta shares dropping as much as 7.9%.
*   A glacier collapse in Blatten, Switzerland, obliterated a significant portion of the village, entailing long-term rebuilding efforts and costs, alongside ongoing expenses for glacier monitoring due to climate change.

# AUD Bullish

## International Relations & Trade
*   China remains Australia's largest export market, with A$196 billion (US$127 billion) in exports last year; Prime Minister Albanese is set to meet with Chinese President Xi Jinping to stabilize Australia-China relations, having worked since 2022 to thaw economic tensions, leading to Beijing easing import curbs on Australian coal, wine, lobster, and other goods. Trade Minister Don Farrell stated a desire to "do more business with China."
*   Australia has only been affected by the US 10% baseline tariff and not by Washington's steeper "reciprocal" tariffs so far. PM Albanese stated Trump's steel tariff increase "will not create any comparative advantage or disadvantage for Australia." Higher US tariffs on Australian exports are unlikely to have a material direct impact as these exports account for only around 1.5% of Australian GDP.
*   The US could intensify cooperation with Australia's Lynas Rare Earths Ltd., the largest producer of separated rare earths outside of China.
*   China and Australia central bank chiefs discussed cooperation.

## Capital Inflows & Investment Activity
*   The spread between Australian 30-year bonds and equivalent Treasuries is around its narrowest level in a year, indicating increased investor capital into Australian debt.
*   A relative move of capital towards Australian assets compared to the United States reflects an increase in capital inflows.
*   Macquarie Bank successfully priced a larger 3-year floating rate note tranche ($4.15 billion FRN vs. $2.45 billion fixed), demonstrating significant investor demand for its floating-rate product.
*   Washington H. Soul Pattinson and Brickworks agreed to a merger, creating a combined group with an expected market value of A$14 billion ($9 billion) and assets spanning property, private equity and credit valued at A$13.1 billion. The deal is expected to simplify structure, add scale, and create a more investable company.
*   The Virgin Australia IPO seeks A$685 million ($443 million), set to be the largest by an airline in Asia for a decade, indicating investor confidence, with the benchmark S&P/ASX 200 index surging about 15% from its April low.
*   A Bain Capital-backed consortium is seeking an A$700 million ($454 million) loan for winemaker Vinarchy, indicating significant private equity investment. Commonwealth Bank of Australia has underwritten the financing.
*   Apollo Global Management manages around A$3 billion ($1.9 billion) of credit assets in Australia, seeking to tap the pension system's demand for unlisted assets.
*   Glencore consolidated its global operational coal assets under an Australian entity (Glencore SA Holdings Pty Ltd.), centralizing coal operations and management in Australia, and acquired international assets through this subsidiary.
*   Foreign investors in Australia's government bond market are expected to face competition from local pension funds, whose demand for Aussie notes may outpace issuance, according to Bank of America.
*   A large Taiwanese insurer has begun building a position in top-rated Australian corporate bonds for diversification.
*   Bridgewater's Asia ex-China Total Return Fund invests across Australian assets, with the fund generating a 20.7% annualized return since its October 2023 inception.

## Domestic Economy & Housing Market
*   The housing market is heating up, with house prices rising and price increases accelerating since the Reserve Bank of Australia (RBA) began cutting rates in February; capital city home values rose 0.5% month-on-month in May (up from 0.2% in April), and seasonally adjusted house prices rose 0.2% month-on-month and 2.1% on a three-month annualized basis. Dwelling turnover increased 6.6% from April.
*   Regional area housing prices rose 0.4% month-on-month in May, with values up 5.3% year-over-year.
*   The housing market divergence has narrowed, with solid price rises across major cities in May: Sydney (+0.5%), Melbourne (+0.4%), Perth (+0.4%), Brisbane (+0.6%), Adelaide (+0.7%).
*   S&P Global Australia May Manufacturing PMI was 51 (prior 51.7), remaining in expansion.
*   The government has pledged to bring the Port of Darwin facility back under Australian ownership, with cross-party support for such a move.

## Commodities & Resources
*   Resource export volumes are considered less sensitive to global demand shifts due to Australia's position as a relatively low-cost producer of bulk commodities like iron ore.
*   A robust wheat outlook is maintained for the 2025/26 season.

## Market Sentiment
*   JPMorgan strategists recommended bets on the Australian dollar as an alternative to the US dollar.
*   Asset managers trimmed their AUD shorts for the first time in five weeks (CFTC data for week ended May 27).
*   China's factory activity contracted at a slower pace in May.

# AUD Bearish

## Monetary Policy & Inflation Outlook
*   The Reserve Bank of Australia (RBA) is expected to cut rates further, with potential cuts in August and November mentioned. Markets are pricing in a near-90% chance of a July cut and see the cash rate around 3.1% by year's end, implying more than three cuts.
*   The RBA lowered the cash rate target by 25 basis points in May, and minutes show the board considered a 50-basis point cut due to global uncertainty and weak domestic conditions. The RBA is prepared for "rapid-fire" rate cuts if Trump's tariffs spark market upheaval.
*   The Melbourne Institute Monthly Inflation Gauge fell 0.4% m/m in May; y/y inflation declined to 2.6% (from 3.3%). Trimmed mean inflation also fell, potentially allowing more RBA easing.
*   Weaker global growth could flow into import prices, making products cheaper and lowering inflation, potentially allowing more RBA easing.
*   National wage growth is expected at just 3.3% by end of 2025 (RBA forecast), with minimum wages raised only 3.5%. More recent data (e.g., Cotality) shows wage growth slowing.
*   The monthly pace of rental growth eased to 0.4% in May, potentially easing inflation pressure.

## Economic Growth & Domestic Weakness
*   Weaker-than-expected economic growth data (GDP advanced only 0.2% in Q1, slower than the predicted 0.4%-0.5%) reinforced the case for further policy easing. Annual GDP expansion was 1.3%, below the 1.5% forecast and the 20-year pre-pandemic average of almost 3% (or 2.7%).
*   GDP per capita declined 0.2% in Q1, marking declines in seven consecutive quarters through 2023-2024 (or nine of the last 11 quarters by another measure). Per-capita GDP was 0.4% lower year-on-year in Q1.
*   Productivity growth is hovering at 60-year lows, with GDP per hour worked flat for two straight quarters. Labour productivity was unchanged in March, stuck at 2016 levels. The RBA could be forced to cut interest rates due to low productivity growth and reduced investment.
*   Household spending rose only 0.1% m/m in April (below 0.2% expected), with annual growth slowing to 3.7%. Goods spending fell 1.1% (e.g., clothing, footwear, new vehicles). Households are among the most heavily indebted globally, and consumers are holding off on purchases, waiting for sales. Real household spending increased only 0.4% in the March quarter, primarily on essentials.
*   Australian retail sales unexpectedly fell 0.1% in April. Private capital investment fell in Q1, and construction work was flat, both confounding expectations for gains. Specific retail categories like clothing, department stores, and food saw declines.
*   S&P Global Australia May Composite PMI fell to 50.5 (from 51), and Services PMI dropped to 50.6 (from 51).
*   Business spending on machinery and equipment fell 1.7% in the March quarter (down 3.7% over the year).
*   Public spending recorded the largest detraction from growth since September quarter 2017, and public demand softened in Q1.
*   The RBA needs a quarterly growth rate of 0.7% to hit its forecast, a level not seen since mid-2022. Nomura considers the RBA's view that GDP picked up in the March quarter to be at risk.
*   Persistent cost-of-living pressures affect borrowers despite rate cuts.
*   National dwelling value was about eight times household income at the end of last year, with home-loan serviceability at an all-time high, indicating housing affordability stress.

## External Risks & Trade Headwinds
*   RBA Chief Economist Sarah Hunter warned Trump's tariff uncertainty could prompt consumers to rein in spending and businesses to shelve hiring/investment. The RBA revised official forecasts for weaker growth, lower inflation, and slightly higher unemployment due to global uncertainty. The national economic outlook is uncertain due to warnings that a global trade war could force businesses and consumers to cut spending.
*   China's Caixin private manufacturing PMI for May dropped to 48.3 (from 50.4), its lowest since September 2022, well below the 50-point expansion threshold and economists' median forecast of 50.7.
*   Travel services exports fell 2.8% due to a government crackdown on foreign student numbers and smaller-than-average international student arrivals, which will shave 0.1 percentage points off Q1 GDP. Tourism services exports might be affected by recent global developments.
*   IDP Education expects student placement volumes to decrease by 28-30% in FY25 and language testing volumes by 18-20% due to policy uncertainty in key destination markets, including Australia. The company's shares plunged 48%, and its adjusted EBIT forecast was lowered. Restrictive policies in Australia continue to affect international student flows.
*   Net trade subtracted 0.1 percentage point from GDP growth in March.
*   First-quarter Current Account Deficit was A$14.663b, wider than the estimated -A$12.5b.
*   China navy live-fire exercises off Australia's east coast in February. China's Ambassador warned Canberra to tread carefully regarding the Port of Darwin lease.

## Domestic Structural & Sector-Specific Issues
*   Mining exploration investment is at its lowest level in years.
*   ANZ-Indeed May Job Ads fell to the lowest since March 2021.
*   Severe weather (Cyclone Alfred, floods) affected economic data and caused an estimated immediate loss of A$2.2 billion ($1.4 billion).
*   UniSuper (A$149 billion pension fund) is increasing cash holdings to near Covid-19 levels due to trade war concerns, moving away from risk assets like Australian equities.
*   Tuesday's auction of 12-year Australian government debt saw the weakest demand in about six years, with a bid-to-cover ratio of 1.98 for an April 2037 note, the lowest since October 2022.
*   The US Secretary of Defense Pete Hegseth requested Australia increase defense spending to 3.5% of GDP "as soon as possible" (currently just over 2%), potentially up to 5%, requiring new revenue sources. Australia announced an additional $10 billion in defense spending, part of the "single biggest peace time increase in defense expenditure."
*   Challenges persist for the Browse gasfields project (A$30 billion development costs, technical difficulties, high CO2 content, weaker long-term gas demand outlook), with operations unlikely before 2035. Carbon capture at the Gorgon project is underperforming.
*   The tax authority opened consultation on "thin capitalization rules" to limit debt interest deductions for multinationals, potentially reducing tax benefits and impacting inbound investment.
*   The ASX has experienced negative net listings in 8 of the last 16 years, with delistings outpacing IPOs for several years.
*   Brookfield is exploring a sale of La Trobe Financial amid executive departures.
*   Citigroup's Australian unit took hit of more than A$70 million after botched block trade selling Goodman Group shares.

## Commodity Market Weakness
*   Iron ore futures in Singapore fell (e.g., as much as 1.5% to $93.80 a ton), and an expected deceleration of steel exports may dampen iron ore demand. Copper, aluminum, and zinc prices also declined.
*   Fading demand from China for steel-making coal and other raw materials is affecting commodity-dependent economies like Mongolia, which has implications for Australia.

# CAD Bullish

## Hawkish Monetary Policy Stance & Inflationary Pressures
*   Core inflation measures surged to 3.15-3.2% in April, the highest in over a year, with Governor Macklem stating core measures "suggest underlying inflation could be firmer than we thought," suggesting persistent inflationary pressures that could lead to a more hawkish BoC stance.
*   The Bank of Canada requires clear evidence inflation is tracking closer to its 2% target before cutting rates, and notes households/businesses still anticipate higher inflation from tariffs, creating a higher bar for rate cuts (RBC Comments).
*   Governor Tiff Macklem noted elevated core inflation and concerns across a variety of inflation metrics in April (RBC Comments).
*   Following strong Q1 GDP, traders pared expectations for a BoC June rate cut to less than 20% odds, and both Bank of Montreal and Royal Bank of Canada abandoned calls for a June rate cut.
*   RBC notes a "fat tail of no more cuts in the cycle" possibility and believes the current balance of risks favors fewer cuts rather than more.
*   The Bank of Canada maintained its key interest rate at 2.75% in June, seen by some as indicating monetary policy stability.

## Positive Economic Performance & Outlook
*   Canada's Q1 GDP rose 2.2% SAAR, beating estimates, driven by a 6.7% climb in exports, a C$8.7B rise in inventory investment, and a 3.4% q/q annualized climb in household disposable income.
*   Preliminary StatCan data shows continued GDP momentum with +0.1% m/m output growth in April, led by mining, oil and gas, and finance (flash estimate also noted as +0.1% m/m for April GDP from "Canada March GDP Rises Mm Ma.pdf").
*   Output rose in 9 of 20 industrial sectors in March, with the goods-producing sector up 0.2% m/m and mining, oil and gas extraction as the largest upside contributor; GDP expanded 1.7% y/y in March.
*   Canada motor vehicle sales increased 7.9% year-over-year in May 2025, reaching 187,000 units compared to 174,000 units in May 2024.

## Favorable Trade Developments & Domestic Policy
*   Canada is seeking deals with the White House to ease steel tariffs, potentially reducing trade barriers for Canadian steel exports, with Prime Minister Mark Carney indicating US talks are progressing. (Canada, Brazil and Mexico are racing for these deals).
*   Macquarie strategists anticipate US-Canada trade reconciliation, with Canada possibly avoiding all "strategic tariffs" once USMCA is re-negotiated, and lowered their year-end USD/CAD projection to 1.34 from 1.36 due to these prospects.
*   Prime Minister Mark Carney is actively pushing to liberalize internal trade between Canadian provinces, a move economists believe would boost economic activity (potentially 0.5% to 8% of GDP), reduce inflationary pressures, and help productivity. Ontario has begun removing its exemptions. Inter-provincial trade totaled C$532 billion ($387 billion) in 2023 (18% of GDP).
*   Prime Minister Mark Carney advocates for streamlining approvals for large-scale infrastructure projects, abolishing inter-provincial trade barriers, and removing barriers to labor mobility, which are pro-growth policies.
*   The Canadian Liberal Party's planned bill to strengthen border security is viewed as a concession to the US, potentially improving trade relations.
*   The shock of rapidly-changing US trade policy may be a positive catalyst for Canada, forcing policymakers to make overdue changes like reducing inter-provincial trade barriers.

## Energy Sector Strength & Investment
*   Canada's energy sector showed strong relative outperformance against US peers (gaining 140 bps while US equivalent fell 1,050 bps in a three-month run), with 2025 earnings forecasts for Canadian energy to dip only 0.2% compared to a 12.1% decline in the US and 16.8% in Europe.
*   Prime Minister Mark Carney sees an opportunity to build a new pipeline for increased oil exports (1 million barrels a day to west coast) and de-carbonization, potentially yielding C$20 billion ($14.6 billion) annually, alongside provincial support for an economic corridor to boost resource shipments.
*   Rain slowed wildfire spread in Alberta, allowing some oil sands production to resume, with Canadian Natural Resources Ltd. expecting to ramp production at its Jackfish 1 site to 36,500 barrels a day by June 6.
*   Petronas is considering the sale of its Canadian energy business, valued at $6-7 billion, representing potential foreign investment inflow.
*   Canadian crude (WCS) climbed to its strongest differential since January 2023 relative to WTI.
*   US crude inventories fell by 4.3 million barrels last week (most since November, EIA data), potentially supporting oil prices.

## Other Bullish Factors
*   Prime Minister Mark Carney hired Marc-André Blanchard, previously head of CDPQ Global at Caisse de dépôt et placement du Québec and its sustainability team, as his chief of staff.
*   Canada's West Coast Port Union signed a deal with employers lasting until 2027, providing labor stability.
*   French quantitative hedge fund Capital Fund Management SA opened a Toronto office to attract wealthy Canadian investors, reporting "significant interest in quantitative strategies."
*   Ivanhoe Mines Ltd. announced progress on reopening parts of the Kamoa-Kakula copper mine complex in Congo, with shares jumping as much as 8.7% in Toronto.
*   A Canadian court dismissed the Canada Revenue Agency's request for information on Shopify Inc.'s domestic merchants.
*   The US Bankruptcy Court for the Southern District of New York granted Chapter 15 protection to Canadian company Giftcraft Ltd.'s US subsidiaries, recognizing Canada as the "center for main interest."
*   Japan plans to raise its incoming foreign direct investment target to ¥120 trillion ($840 billion) by 2030, with potential Canadian mining sector benefits.

# CAD Bearish

## Significant Trade Headwinds & Tariff Impacts
*   Canada is highly exposed to US steel and aluminum tariff increases (doubled to 50% on Canadian exports), with these exports to the US worth more than 1.5% of Canadian GDP. The Canadian Steel Producers Association stated, "At 50%, it's going to devastate the industry," with producers having already shed about 700 jobs. The Aluminium Association of Canada estimates a 50% duty means an added cost of almost $75 million per week.
*   US tariffs on Canadian goods (steel, aluminum, autos) have hurt the labor market and weakened business and consumer confidence. About one-fifth of Canada's output is tied to US trade, making the economy vulnerable.
*   US tariffs are termed "the biggest headwind facing the Canadian economy," with fentanyl-related tariffs of 25% (10% on energy and potash) from March, contributing to an estimated overall tariff shock of about 5ppt.
*   Trump's "revenge tax" (Section 899) proposal would impose higher taxes (rates rising by 5 percentage points initially) on Canadian companies and investors with US income, creating uncertainty, especially for Canadian banks with large US operations.
*   Trump's erratic policy announcements have led Canadian companies to scramble for new buyers, with economists forecasting a sharp decline in exports mid-year. Over half of Canada's goods imports are from the US, and about three-quarters of its goods exports go to the US.
*   Canada's April international merchandise trade deficit was expected to widen significantly to -1.5 billion from -510 million.
*   Cleveland-Cliffs CEO stated Trump's auto and steel tariffs on Canada "impacted clients," and the company wouldn't have bought Canadian steelmaker Stelco "if I knew that Canada would not be treated like a friend."

## Economic Slowdown & Recession Concerns
*   Economists surveyed by Bloomberg expect two consecutive quarters of negative growth (a technical recession) in mid-2024. TD Bank's Leslie Preston expects Canada's economy to likely tip into recession this year unless there's a trade negotiation miracle.
*   The unemployment rate is rising (reaching a five-month high as per "Bank of Canada Holds Key Rate.pdf" and expected to reach 7.0% in the May labor survey from 6.9% in April), with weakening labor market conditions, job losses in trade-exposed sectors (manufacturing employment -1% in April YoY; -31,000 positions in April jobs data), and businesses planning to scale back hiring. Consumer confidence has also dropped sharply. Employment is expected to show a modest increase of only 10k jobs in May.
*   Q1 GDP showed material weakness in domestic demand, with final domestic demand stalling as slow household spending was offset by declining fixed investment and a drop in housing and intellectual property investment. The housing market was languishing according to Q1 data.
*   Bank of Canada surveys showed business sentiment was "sharply" lower amid tariff uncertainty, with firms putting investment and hiring plans on hold.
*   US firms stockpiling Canadian goods in Q1 sets the stage for Canadian exports to slow mid-year; elevated domestic inventories are likely to lead to slower Q2 investment. Recent Q1 strength could be a temporary consequence of front-running tariffs and businesses rushing exports.
*   The Canadian economy is expected by some to contract starting in Q2 due to falling spending from a stalling labor market and halted investment plans.
*   The Bank of Canada is likely to see softness under the surface of the Q1 GDP report despite a headline growth surprise, as the upside was partly due to downward revisions of past data.

## Potential for Dovish Monetary Policy Shift
*   Bank of Canada Governor Macklem indicated risks are skewed toward additional rate cuts this year, with Bloomberg Economics expecting rate cuts to resume as soon as Q3.
*   Governor Macklem expects Q2 economic growth to be "much weaker" and stated a rate cut might be necessary if the economy stalls amid U.S. tariffs. He also said another rate cut might be needed if the economy stalls due to U.S. trade policy uncertainty after the BoC held rates at 2.75%.
*   Market expectations (swaps, strategists) show a significant probability of BoC rate cuts in July and further cuts by year-end, with some economists forecasting rates as low as 2% or even a risk of returning to zero on this cycle due to a "very frail" domestic economy and trade uncertainties.
*   TD strategists expect the Bank of Canada to send dovish signals at its June meeting, emphasizing trade uncertainty.
*   The BoC is proceeding "less forward-looking than usual" due to unusual uncertainty, facing a "risky" June rate decision described as "mission impossible" by CityNews Toronto. Scotiabank notes a conflict in the BoC's communications that needs reconciliation.

## Energy Sector Disruptions & Negative Outlook
*   Wildfires in Western Canada (Alberta, Saskatchewan, Manitoba) are threatening and shutting down significant oil and gas production (e.g., nearly 350,000 barrels/day at one point – about 7% of Canada's total oil output; 26 wildfires out of control in Alberta). This includes operations of Cenovus (Christina Lake 238,000 bpd site shut), MEG Energy (affected by power cuts), Canadian Natural Resources, Hudbay Minerals, SSR Mining, Alamos Gold, and Sinomine Resource Group. States of emergency were declared, with two deaths and over 25,000 evacuations.
*   The Canadian Heavy crude (WCS) differential to WTI weakened to its lowest since May 29 due to wildfire impacts on production.
*   Global crude oil stockpiles are rising rapidly, with OPEC+ increasing supply and the IEA warning of oversupply, which could lower oil prices and negatively impact Canadian oil producers.
*   Desjardins downgraded Canadian oil and gas companies due to a bearish outlook from softer oil prices, with specific concerns for Imperial Oil, Tamarack Valley Energy, and Whitecap Resources regarding FCF, commodity prices, and dividend sustainability.

## Broader Economic & Financial Risks
*   All of Canada's big six banks increased loan loss provisions in Q2 due to expectations of slower economic growth and higher unemployment, with RBC and Scotiabank missing earnings estimates.
*   A slowdown in Canadian venture-capital deals occurred in Q1, attributed to the chilling effect of the US trade war on financing for early-stage firms.
*   Canadian retail supplier Giftcraft Ltd. filed for bankruptcy protection due to sales collapse following US tariff announcements.

## Other Bearish Factors
*   Diplomatic ties between Canada and India remain frayed, leading to India's exclusion from the G-7 summit hosted by Canada (first time in six years) due to alleged Indian government involvement in homicides targeting Sikhs in Canada, potentially impacting long-term trade/investment.
*   Restrictive policies in Canada are affecting the international student market, a key services export.
*   Teck Resources Ltd. suffered port and mechanical disruptions at its Chilean copper mines (Quebrada Blanca, Carmen de Andacollo), impacting output.
*   Economic activity was initially estimated by StatCan to slow to an annualized 1.9% in Q1 (later revised to 2.2%), with energy extraction, mining, and retail trade weighing on growth. PMIs showed declining output, and residential construction appeared to slow at that time.

# NZD Bullish

## Positive Economic Fundamentals & Outlook
*   The New Zealand economy is reported to be gathering momentum and is expected to expand by 1.4% in 2025.
*   New Zealand's 10-month budget deficit came in at NZ$7.44b, NZ$82m narrower than the NZ$7.53b projected, as core Crown tax revenue was NZ$720m higher (company tax ~NZ$400m higher due to strong PIE tax) and expenses were NZ$129m lower than forecast.
*   A trend of increased public spending and rising debt-to-GDP (from 28% in 2018 to 46% by 2024) is reportedly being reversed under the current government.

## Strong External Sector Performance
*   Export prices rose 7.1% in Q1 (now 17% higher YoY), led by a 10% increase in dairy product prices (milk powder +13%, butter +38% vs March 2024 QTR), a 7.2% rise in meat product prices, and a 4.9% climb in forestry export values.
*   NZ 1Q Terms of Trade rose 1.9% Q/q.

## Supportive Government Policies & Investment
*   The government reversed its ban on oil and gas exploration, plans to double mineral exports to NZ$3bn over the next decade, announced extra tax breaks for businesses in the 2025 budget, and scrapped a planned digital services tax.
*   A revamped "golden visa" program attracted applications equating to about NZ$600 million in potential direct investment in six weeks (since April 1st) – almost as many as the previous program received in 2.5 years – with the government actively welcoming foreign direct investment.

## Domestic Demand & Activity
*   Consumer spending through core retail merchants rose 1.8% year-on-year in May to NZ$3.08 billion, with the Auckland/Northland region seeing a 1.1% rise (above May 2024 levels) after eight prior months of decline.
*   Residential building volume rose 2.6% in Q1 (the first increase since Q3 2022), and building approvals reached a 21-month high in Q1, suggesting increased developer confidence.
*   New Zealand property listings and asking prices both rose in May.

## Market Positioning & Other
*   Leveraged funds trimmed short NZD positioning, while asset managers eased their short positioning for a second week, according to CFTC data for the week ended May 27.
*   New Zealand Rugby secured a multi-year sponsorship deal with US-based Gallagher Insurance as jersey sponsor.

# NZD Bearish

## Dovish Monetary Policy & Outlook
*   The Reserve Bank of New Zealand (RBNZ) cut the Official Cash Rate (OCR) by 25 basis points to 3.25% (totaling 225 bps in cuts since August), lowered its forecast track for the benchmark rate (potentially below 3%), and its central projection envisages at least one more 25-point cut, signaling further easing may be needed.
*   Bloomberg Economics expects the RBNZ will deliver a further 75 basis points of rate cuts by end of 2025, taking the OCR below neutral, as the RBNZ is seen as underestimating the degree of easing needed. ASB Bank also forecasts RBNZ rate cuts in August and October after a July pause.
*   The RBNZ stated it needs more time to assess the impact of global trade turmoil, citing "significant uncertainty" (Assistant Governor Karen Silk: "fog is quite thick"), creating uncertainty about future policy direction. One Monetary Policy Committee member voted to hold rates steady at the last meeting due to heightened uncertainty, and the RBNZ presented a scenario where a weaker global economy could result in a lower OCR from the December quarter.

## Economic Headwinds & External Risks
*   Higher tariffs and increased global uncertainty are damping the New Zealand economy, posing a fresh headwind to growth, and are likely to curb business investment and dent consumer confidence.
*   China's private manufacturing gauge plunged to its weakest level since September 2022, signaling weakness in a key trading partner.
*   NZ 1Q Terms of Trade rose 1.9% Q/q, missing the +3.5% estimate.

## Weakening Domestic Indicators
*   New Zealand house prices fell for a second straight month in May (-0.1% m/m, -1.6% y/y), with Auckland average house prices also declining. The property market reportedly lacks momentum due to a large overhang of houses for sale, and Cotality's 5% price growth projection for the year is seen as "a bit strong".
*   The NZ May Consumer Confidence Index fell to 92.9 (ANZ).
*   Credit growth is slowing: new residential lending declined by ~NZ$70m m/m to NZ$8.0b in April, new business lending fell to NZ$2.7b, and total new lending fell by ~NZ$230m m/m to NZ$12.3b.
*   NZ April Home-Building Approvals fell 15.6% month-on-month, a sharp contrast to the Q1 rise in building volume and approvals.
*   New Zealand's economy and labor market remain constrained, according to Cotality's chief property economist.

## Regulatory & Technical Factors
*   The Commerce Commission will simplify the Grocery Supply Code to reduce payments supermarkets charge suppliers (targeting practices reportedly involving ~NZ$5b in rebates at suppliers' expense), potentially impacting supermarket profitability.
*   The RBNZ will discontinue the Standing Rep Facility (which saw minimal usage) and weekly auctions of Reserve Bank bills, effective June 17. Pricing on the Bond Lending Facility will revert to OCR minus 50bps from minus 25bps, widening the discount.

# SEK Bullish

## Strong Investment and Capital Inflows
*   Brookfield Asset Management plans to invest up to 95 billion kronor ($9.9 billion) over 10-15 years in AI infrastructure in Sweden, including a 750-megawatt data center in Strangnas. Prime Minister Ulf Kristersson noted this as one of Sweden's largest AI infrastructure investments. Nvidia Corp. and Wallenberg family companies are also planning AI technology center development in Sweden.
*   Stockholm has been Europe's busiest exchange year-to-date, securing over $1.5 billion in IPOs, with European listings expected to resume.
*   Hacksaw, a technology-first RGS platform and game supplier, plans to launch an IPO on Nasdaq Stockholm (expected Q2 2025), with long-term financial targets of over 30% annual growth and EBIT margins above 80%. The board aims to return no less than 75% of net profit to shareholders. The offering targets the general public in Sweden, Denmark, Finland, and Norway, plus institutional investors.
*   Flat Capital AB raised 300 million Swedish kronor ($31.4 million) in a rights issue, with significant participation from existing owners and new prominent Swedish business families (e.g., Persson of H&M, Kamprad of Ikea, Schorling, Olsson of Stena), to fund further investments.
*   Alvotech intends a private placement of ~7.5 million Swedish Depository Receipts (SDRs) and shares to Swedish and international institutional investors, to broaden its shareholder base (especially in Sweden) and fund R&D in Sweden (related to its Xbrane acquisition). SDRs are listed on Nasdaq Stockholm with payment in SEK.
*   The IPO offering for Sentia, a Nordic construction unit (partly owned by Swedish investor Ratos AB), was oversubscribed on full deal size including over-allotment facility, indicating strong investor demand for the $160 million offering. Ratos AB is reducing its stake in Sentia through the IPO to facilitate growth. Sentia was formed from the consolidation of Swedish SSEA Group and Norwegian HENT.
*   Investor AB will utilize its mandate to buy back up to 560,000 Class B shares on Nasdaq Stockholm before June 17, 2025.
*   MEKO is considering a new senior unsecured bond issuance of SEK 1.25 billion with a 3 and/or 5 year tenor and has announced a conditional tender offer for outstanding bonds, with major Nordic banks as joint bookrunners.

## Positive Corporate Developments and Export Agreements
*   The Czech Defense Ministry approved extending the lease of Swedish JAS-39 Gripen fighter jets until 2035, for which the Czech Republic will pay 6.01 billion kronor ($627 million). The contract is about 25% cheaper than Sweden's previous offer.
*   Peab won a Svea Court of Appeal judgment obliging Unibail-Rodamco-Westfield (URW) to immediately pay Peab around SEK 1.6 billion related to the Mall of Scandinavia. Peab is taking steps to enforce payment.

## Robust Financial Market Activity and Currency Performance
*   The Swedish krona remains the best-performing major currency year-to-date despite a minimal decline following a recent inflation data release.
*   The Riksbank has established a framework for the transaction-based reference rate SWESTR, enhancing financial market infrastructure.

# SEK Bearish

## Weak Economic Performance and Outlook
*   Sweden's economy contracted by 0.2% in Q1 2025, severely undercutting Riksbank's 0.5% expansion forecast and the 0.1% median growth expectation. This followed a downwardly revised 0.5% growth in Q4 2024 (from an initial 0.8%).
*   The Q1 GDP contraction included a 0.2% shrinkage in household expenditures (below Bloomberg Economics' 0.3% expansion call and Riksbank's 0.4% expectation) and a nearly 4% tumble in capital formation (investments fell 3.8%, the biggest decline since Q2 2020), which subtracted a full percentage point from growth. Domestic demand remains weak.
*   Sweden's annual GDP growth outlook for 2025 has been revised down (e.g., to 1.5% from 1.7% by Bloomberg Economics, which expects lackluster expansion; Danske Bank forecasts 1.6%).
*   Riksbank Governor Erik Thedeen acknowledged that Q1 GDP was weaker than expected.

## Dovish Monetary Policy Stance and Rate Cut Expectations
*   The Riksbank is expected to cut interest rates, potentially as early as June (moved up from August expectations), to support the weak domestic economy, with multiple cuts possible if downside risks materialize. The policy rate is currently 2.25%, with expectations for a cut to 2.00%.
*   Market pricing indicates a high probability of a Riksbank rate cut in June (e.g., over 70% chance, 60% probability of a 25bp cut, pricing 13-19 basis points of cuts).
*   Danske Bank expects Sweden's Riksbank to cut its main interest rate to 2% in August, a more dovish stance than previous forecasts.
*   Despite some inflation metrics being above the 2% target, the Riksbank is still expected to cut rates due to the weak economy, indicating that supporting growth is the priority. Governor Thedeen noted uncertainty abroad has "increased sharply."

## Inflation Trends Supporting Easing
*   Swedish core inflation (CPIF excluding energy) slowed to 2.5% in May from 3.1% in April (a five-month low). Underlying inflation in May was 2.5%, the mildest this year. CPIF inflation held at 2.3% in May, below some survey medians. Svenska Handelsbanken noted underlying inflation momentum has "likely peaked."
*   The Riksbank guided in May that inflation is "somewhat more probable" to be lower than its March forecast, suggesting potential for monetary policy easing. Economists note the inflation outlook as "increasingly benign," supporting softer policy.
*   While Riksbank Governor Erik Thedeen noted inflation was "slightly higher than expected" at the beginning of 2025, the Riksbank sees part of this rise as "temporary." Inflation is expected to average 2.4% in 2025 and potentially surge towards 3% by late summer. Firms' year-ahead price expectations rose to 2.7% from 1.7% in January.
*   CPIF inflation is expected to remain below the Riksbank's 2% target on average in 2026. April inflation was very low at 0.3% annually.

## Labor Market Deterioration and Low Consumer Confidence
*   Sweden's unemployment rate jumped to 8.5% in April from 8.1% in March and is expected to remain elevated above 8%.
*   Consumer sentiment in Sweden plummeted below pandemic trough levels in April/May surveys, according to the National Institute of Economic Research.

## External Headwinds and Trade Risks
*   Trump's potential tariff campaign puts an estimated 0.5% of Swedish GDP at risk, with an effective tariff hike of about 12 percentage points for Sweden's exports to the US (sectoral tariffs on cars contribute 5.7 pp). Trade models suggest tariffs could wipe out just under 20% of Sweden's exports to the US in the medium term.
*   The strengthening Swedish krona (up 16% against USD this year) is creating currency headwinds for Swedish exporters like steelmaker Alleima, potentially causing a 9% downside to 2025 earnings for Alleima, which are hard to offset in the short term.

## Sector-Specific Concerns
*   The Swedish housing market recovery is at risk of delay due to surging long-term borrowing costs and trade war uncertainty. House prices are around 6% below fundamental equilibrium levels according to Bloomberg Economics models.
*   The Swedish bankruptcy rate increased 3% year-over-year in May to 906 limited liability companies. Year-to-date bankruptcies (4,616) match last year's pace despite recovery expectations, with retail and restaurant industries particularly affected due to reduced consumer spending and tariff uncertainty.

## Company-Specific Negative News
*   Hemnet shares fell as much as 8.4% after a Nordea double-downgrade to sell, citing risks from monetization pushes, competition, and elevated risk that rivals will gain market share as price sensitivity builds.
*   Intrum Sverige is under review by the Swedish FSA regarding its parent company reorganization's impact on its operational compliance.
*   Ilija Batljan Invest is offering to redeem outstanding senior bonds at 60% of nominal amount and subordinated hybrids at 20% of nominal amount, indicating significant financial distress.
*   Spotify was ordered by a Stockholm Court to pay a SEK 58 million fine for GDPR breaches related to data subject rights and data handling under EU GDPR.

# NOK Bullish

## Monetary Policy & Financial Sector
*   Norges Bank postponed interest rate cuts to September, delaying anticipated monetary easing and suggesting a more hawkish monetary policy stance, which is generally supportive for the currency.
*   Norges Bank increased its shareholding in Nordea Bank Abp to 5.04%, crossing the 5% disclosure threshold on January 15, 2025, a move reflecting potential confidence in the financial sector.
*   Norway's $1.8 trillion sovereign wealth fund (NBIM) is developing proprietary models and data analysis systems to enhance its bond trading operations, aiming for improved pricing and operational efficiency in managing national wealth.
*   Norges Bank is advancing its Central Bank Digital Currency (CBDC) project with experimental testing of tokenization and central bank settlement, aiming for a recommendation by year-end, showcasing innovation in its already efficient and secure low-cash payment system.

## Energy Sector Strength & Exports
*   Equinor secured a £20 billion ($27.1 billion) long-term gas supply contract with UK's Centrica, agreeing to supply 5 billion cubic meters per year until 2035, reinforcing Norway's position as a key energy supplier to Europe; this is supported by strong UK-Norway energy cooperation, with Norway already supplying half of the UK's gas imports.
*   Platts raised July North Sea quality premiums to multi-month highs: Oseberg to $1.4612 (highest since July 2024), Ekofisk to $1.1310 (highest since September), and Troll to $1.5203 (highest since September), improving terms of trade for Norwegian oil.
*   Loadings of 13 main North Sea crudes are scheduled to increase to 2.03 million b/d (62.88 million barrels) in July from 1.78 million b/d (53.43 million barrels) in June, with Gullfaks crude loadings also rising, indicating higher oil export volumes.
*   The Johan Castberg oil field commenced exports in May after long delays, with two tankers loading approximately 700,000 barrels each; overall North Sea crude flows in May (1.99 million b/d) maintained near-record production levels.
*   Extensive planned maintenance and corrective works (e.g., Troll field optimization) across Norway's major gas export infrastructure indicate strong operational investment and long-term production capacity optimization.
*   Norwegian oil shipments to Asia increased to 6 million barrels in May from 4 million barrels in April, including VLCCs chartered by Equinor heading to China with Johan Sverdrup crude, indicating market diversification and strong Asian demand.
*   China is set to receive its first LPG cargo from Norway since 2019, loaded from Karsto port, as Chinese importers seek alternatives amid US-China trade tensions, potentially opening a renewed export avenue.
*   Ukraine has received positive signals from Norway regarding potential natural gas deliveries to help cover its winter needs, with Ukraine's Naftogaz in talks to secure €1 billion for gas purchases, potentially increasing demand for Norwegian gas.
*   Aker BP and Aker Solutions are advancing drone technology for offshore platform inspections (e.g., at the Edvard Grieg platform, operated remotely from Stavanger), enhancing operational efficiency and moving towards autonomous inspections in Norway's key oil sector.

## Domestic Economic Activity & Investment
*   Norway's manufacturing PMI rose to 51.2 in May from a revised 46.2 in April (DNB data), moving into expansion territory (above 50), with the new orders component improving significantly to 48.2 from 38.5, indicating a recovery in manufacturing activity.
*   Endúr's Total Betong secured a NOK 480 million contract for the Jåtunparken residential project in Stavanger (131 apartments, four buildings, and store facilities), with construction scheduled from late 2025/early 2026, indicating sustained economic activity in Norway's construction sector.
*   Veidekke secured a NOK 230 million contract from real estate developer Nåbo for an apartment development in Vestby (131 apartments), with construction planned from September 2025 to the first half of 2027, contributing to construction sector activity.
*   The Sentia AS (construction company) IPO in Oslo aims to raise NOK 1.6 billion ($160 million), with strong cornerstone investor support (including DNB Asset Management and Arctic Asset Management committed to NOK 670 million), reflecting investor confidence; the company reported NOK 10.6 billion in revenues in 2024.
*   DNO ASA, a Norwegian oil company, is issuing a minimum $300 million hybrid bond with strong international investor interest, demonstrating access to international capital markets for refinancing and general corporate purposes within the energy sector.
*   Axactor has mandated banks for a potential €100m senior unsecured bond issue with a 4-year tenor, with proceeds intended for refinancing existing debt, showing continued access to capital markets for Norwegian corporations.
*   Public Property Invest's acquisition of seven nursing homes in Oslo for NOK 410 million, generating NOK 30 million in annual rent on 35-year triple net lease contracts, signals foreign investment interest and stable cash flows in Norwegian real estate.
*   Morrow Batteries is finalizing the commissioning of its factory in southern Norway and will begin delivering commercial lithium-iron phosphate cells over summer 2025, with the CEO reporting "very strong yields," signaling growth in a new industrial sector.
*   Kongsberg secured a significant NOK 6.5 billion order from the German government for Joint Strike Missiles for F-35 fighter jets, structured as a government-to-government sale, boosting high-tech exports.
*   Wallenius Wilhelmsen, a Norwegian shipping company, renewed a logistics contract with an automotive OEM customer worth approximately $100 million over three years, securing ongoing service export revenue.

## Housing Market Strength
*   Sales volumes of existing homes in Norway are on track for a record year, with a 16% gain so far in 2025, supported by high wage growth, structural factors like low supply and unemployment, and the mortgage equity requirement being eased to 10% from 15%.
*   Norway's housing market continues to outperform Nordic peers, with prices rising 3.6% last year (versus 2% for euro area peers) and 53% over the last decade (versus 48% in the euro area), indicating robust underlying demand.

# NOK Bearish

## Energy Sector Challenges & Global Oil Market
*   OPEC+ has agreed to increase oil supply by 411,000 barrels a day to the market in July, with some analysts (e.g., JPMorgan) forecasting Brent futures could sink into the "high $50s" later this year due to a potential global supply glut, creating financial headwinds for oil-exporting nations like Norway.
*   Multiple Norwegian gas infrastructure facilities are undergoing maintenance or experiencing outages, leading to reduced gas export volumes from Norway to northwest Europe in the near term. This includes:
    *   Kollsnes gas processing plant experiencing capacity reductions and seasonal maintenance.
    *   Troll field maintenance and unplanned works reducing supply by 16.9 mcm/day.
    *   Outages at Karsto and the Hammerfest LNG plant.
*   Norway's Johan Sverdrup oil field is expected to have marginally reduced production in July, with loadings anticipated to fall to a 2-year low, due to the drilling of a new well.
*   Environmental groups and fisheries have filed a lawsuit challenging the U.S. Interior Department's decision to resurrect Equinor ASA's Empire Wind 1 offshore project, alleging significant unmitigable ecological harm, posing legal and reputational risks for the Norwegian energy company's international ventures.

## Domestic Economic & Export Concerns
*   Norway's seasonally adjusted home prices remained unchanged in May, following a 0.2% decline in April (the first in nine months), falling short of Norges Bank's expectation of a 0.5% gain and with interest rate cuts postponed to September, indicating a cooldown in the housing market.
*   Norwegian seafood exports fell 2% year-over-year to NOK 13.6 billion in May, ending a 10-month growth streak. This decline was attributed partly to a stronger krone impacting export values (especially against the dollar), alongside slumped salmon prices and reduced volumes for clipfish.

## Direct Currency Flows
*   Norges Bank planned daily FX sales of NOK 126 million in June to fund the transfer of dividends to the government, representing a direct supply of NOK to the market.

# CRYPTO Bullish

## Institutional Adoption & Capital Inflows
*   Spot-Bitcoin ETFs have accumulated $128 billion in assets since their January 2024 introduction, with US Bitcoin ETFs attracting over $US9 billion in capital in the five weeks to May 29; BlackRock's Bitcoin Trust alone received $US6.35 billion, its largest monthly inflow.
*   JPMorgan Chase will provide financing against crypto exchange-traded funds (ETFs), starting with BlackRock's iShares Bitcoin Trust, and will incorporate clients' crypto holdings into net worth assessments for borrowing capacity globally.
*   Major banks, including Morgan Stanley (planning crypto trading on E*Trade), are increasing client access to crypto due to strong demand and a more favorable regulatory environment.
*   Circle Internet Group raised $1.1 billion in an upsized IPO (pricing at $31, above the $27-$28 range) with demand exceeding supply by over 25 times, signaling strong investor interest in stablecoin companies.
*   Major institutional investors, including ARK Investment Management (showing interest for up to $150 million) and BlackRock (planning to acquire about 10% of IPO shares), participated in Circle's IPO. BlackRock also manages the $53.3 billion Circle Reserve Fund backing the USDC stablecoin.
*   Australian Bitcoin ETFs saw $87.3 million in inflows in May, significantly outpacing gold ETF inflows, and have recorded net inflows every month of the current year.
*   Coinbase Global was added to the S&P 500 in 2025, jumping 23% after announcement day (the greatest gain for a new member in 10 years), signaling increased mainstream acceptance and maturation of the crypto industry.
*   The U.S. Labor Department has adopted a neutral stance on whether companies should allow cryptocurrency in 401(k) retirement plans, opening a potential avenue for significant investment inflows.

## Favorable Regulatory & Political Developments
*   The Trump administration has initiated the removal of regulatory barriers for crypto and promoted supportive policies, influenced by industry support and donations that helped propel Trump and crypto-friendly politicians into power.
*   Michelle Bowman's confirmation as Fed Vice Chair for Supervision indicates a potential shift towards lighter, "tailored" financial regulation; Treasury Secretary Scott Bessent is coordinating efforts to streamline oversight and possibly ease bank capital rules, which could foster a more favorable environment for crypto.
*   Ripple achieved a favorable settlement with the SEC (paying $50 million instead of the $2 billion sought) and was endorsed by Trump for a new U.S. "Crypto Strategic Reserve," with Ripple continuing to engage officials on crypto regulation.
*   Stablecoins, such as Circle's USDC (which holds a 29% market share with $61 billion in circulation as of May 29), are expected to be regulated by US Congressional legislation, potentially enhancing their perceived legitimacy.
*   Significant staff and budget cuts at the Consumer Financial Protection Bureau (CFPB) (voluntarily dismissed ~20 enforcement actions, plans to cut ~1,500 of >1,700 workforce), along with dismissal of enforcement actions, signal a broader de-regulatory trend under the Trump administration that could indirectly benefit crypto adoption and innovation by easing pressure on financial institutions.
*   South Korea's crypto industry is anticipated to benefit regardless of the outcome of upcoming elections, according to Bloomberg analysis.

## Positive Market Dynamics & Macroeconomic Factors
*   Rumors of Federal Reserve Chair Jerome Powell's potential resignation and the Trump administration's intention to lower interest rates are viewed as highly bullish for crypto, with President Trump actively advocating for rate cuts.
*   Proposed large-scale U.S. fiscal expansion, including permanent tax cuts increasing the deficit and a $4-5 trillion debt ceiling increase, could be perceived as inflationary or indicative of USD debasement, enhancing the appeal of alternative assets like crypto.
*   Bitcoin is reportedly showing increasing decoupling from riskier assets and low correlation with traditional markets like the Nasdaq, US dollar, and gold, enhancing its appeal as a diversified asset allocation and behaving more like an independent, reliable asset.
*   Demand for Bitcoin has reportedly been buoyed by favorable regulatory tailwinds and macroeconomic uncertainty stemming from Trump's trade agenda.
*   Economic challenges in China, including deflation and crackdowns on private enterprise, alongside a tax crackdown on offshore investments, may drive capital flight from mainland China, potentially into cryptocurrencies as alternative stores of value.
*   The Trump administration's plans for broader technology restrictions on China could further incentivize capital flight from China, potentially benefiting crypto markets.

## Corporate & Technological Advancements
*   Yusys Technologies, a Chinese software company, is offering stablecoin services, including support for overseas financial institutions, and received backing from a Macau technology fund for research on a Web3-based stablecoin retail payment system.
*   CMC Markets is significantly investing in decentralized finance (DeFi) and Web 3.0, viewing the shift as "inevitable" and targeting a "much bigger market," with a two-year plan to transition its business and expand 24/7 crypto trading.
*   Norges Bank (Norway's central bank) is conducting experimental testing of tokenization and central bank settlement technologies as part of its CBDC project, with a decision basis expected in autumn and a final recommendation by year-end.

# CRYPTO Bearish

## Valuation Concerns & Market Risks
*   The Bitcoin/gold ratio, which peaked at 33x in May 2025, is considered overvalued by a Bloomberg Intelligence model suggesting a fair value closer to 18x (compared to the current 31x on June 2), with potential for the ratio to revert towards 10x in a recession.
*   Bitcoin's ratio relative to the S&P 500 reached a record 19x, with analytical models indicating risks of reversion back to approximately 8x.
*   Bitcoin maintains a high correlation to the S&P 500 (nearly 0.70 on a 16-quarter basis), making it susceptible to declines in the broader stock market. Analysts project Bitcoin could fall to $40,000 and the Bloomberg Galaxy Crypto Index (BGCI) to 1,000 if the S&P 500 experiences a significant downturn (e.g., drops to 4,000) in a recession.
*   Analysts suggest that Bitcoin's phase of "early maturation and rapid appreciation" may be concluding, with the "unlimited cryptocurrency supply" (millions of competing cryptocurrencies, with about 16 million listed on CoinMarketCap) creating downward price pressure and limiting appreciation, as evidenced by the Bloomberg Galaxy Crypto Index (BGCI) struggling to surpass its 2021 peak (3,000 level).
*   Some analysts opine that the confluence of Bitcoin ETF launches and President Trump's shift to a supportive stance may represent "peak conditions" for Bitcoin.
*   An analyst perspective suggests that Bitcoin, due to its high volatility, speculative nature, and unlimited supply, acts as a leading indicator with prevailing downside price risks.
*   Systematic risks associated with highly speculative cryptocurrencies are a concern, as highlighted by analyses such as Dogecoin's "same-chart syndrome" relative to the Bitcoin/gold cross metric.

## Regulatory & Political Headwinds
*   The U.S. Commodity Futures Trading Commission (CFTC) is facing regulatory gridlock, reduced to two members (both of whom have announced resignations, as of June 1) with no scheduled confirmation hearing for a nominee. This situation hinders the advancement of the Trump administration's crypto policy priorities, forcing reliance on permanent agency staff who themselves may be part of an administration effort to disassemble such civil servant groups.
*   Australian regulatory body Austrac has imposed a A$5,000 ($3,250) limit on cash deposits and withdrawals at cryptocurrency ATMs, refused to renew the registration of one crypto ATM provider due to "disturbing trends" of scam/fraud-related transactions, and introduced enhanced customer due diligence obligations, mandatory scam warnings, and more robust transaction monitoring. Austrac cited concerns about the use of crypto ATMs in scams and fraud, warned of heightened criminal risk, and expects digital currency exchanges to consider similar limits for cash transactions.
*   A political scandal in the Czech Republic, where the Justice Ministry accepted a $45 million Bitcoin donation from a convicted drug dealer, led to the Justice Minister's resignation and a prosecutorial probe. This incident has generated negative publicity, associating cryptocurrency with criminal activity, and sparked calls for government resignation, creating adverse regulatory and political attention for the crypto sector.

# Macro Mosaic Comprehensive Report
*Generated on 2025-06-05 10:06:11*

## Volatility-Weighted Returns Analysis
### Summary of Recent Performance
|     | MoM    | 3M      | 6M      | 12M     |
|:----|:-------|:--------|:--------|:--------|
| BTC | -0.16% | 8.87%   | 3.97%   | 23.47%  |
| GLD | 2.09%  | 8.34%   | 35.19%  | 55.42%  |
| S&P | 0.51%  | -1.39%  | -7.80%  | -1.57%  |
| 30Y | 0.75%  | -6.74%  | -1.17%  | -8.25%  |
| COM | 3.22%  | -8.89%  | -2.92%  | -13.40% |
| USD | -1.80% | -12.56% | -21.80% | -18.65% |

### Analysis
1. Significant Trends in Volatility-Weighted Returns:
   - Gold (GLD) is demonstrating consistently robust risk-adjusted performance, notably accelerating over the longer horizons (35.19% at 6M and 55.42% at 12M). This indicates a sustained bullish regime for gold, strongly outperforming other asset classes.
   - Bitcoin (BTC) is positive on longer horizons (8.87% at 3M, 23.47% at 12M), but recent momentum has stalled (-0.16% MoM). This suggests a moderation in risk appetite for crypto assets in the immediate term.
   - Equities (S&P) and long-duration bonds (30Y) remain weak across most timeframes, with negative volatility-adjusted returns over 3M, 6M, and 12M horizons. This indicates persistent headwinds for traditional risk assets.
   - Commodities (COM) have shown a recent short-term rebound (3.22% MoM), but remain deeply negative on longer horizons, reflecting ongoing structural weakness.
   - The USD has consistently negative volatility-weighted returns across all timeframes, highlighting a clear bearish dollar regime.

2. Strongest Risk-Adjusted Performance:
   - Gold (GLD) clearly stands out as the strongest asset on a volatility-adjusted basis, especially over longer timeframes (12M: 55.42%).
   - Bitcoin (BTC) also shows solid longer-term risk-adjusted returns (12M: 23.47%), despite recent near-term softness.

3. Notable Shifts in Market Regime or Relative Performance:
   - A clear shift toward safe-haven and alternative assets (GLD, BTC) and away from traditional risk assets (S&P, 30Y, COM) and the USD.
   - The recent short-term bounce in commodities (COM: 3.22% MoM) may signal early signs of stabilization or bottoming in commodity markets, which warrants close monitoring.
   - The pronounced and sustained bearish regime in USD (-21.80% at 6M, -18.65% at 12M) is notable, suggesting ongoing structural weakness in the dollar and potential tailwinds for non-USD denominated assets.

4. Actionable Insights Based on Risk-Adjusted Returns:
   - Continue overweighting gold exposure given its superior risk-adjusted returns and sustained bullish regime.
   - Maintain caution on traditional risk assets (equities, long-duration bonds) given persistently negative volatility-adjusted returns; consider tactical underweights or hedging strategies.
   - Monitor Bitcoin closely: despite recent softness, its longer-term positive volatility-adjusted returns suggest it remains a viable alternative asset allocation, especially if risk appetite stabilizes.
   - Given the pronounced bearish USD regime, consider currency positioning that benefits from continued dollar weakness, such as overweighting non-USD denominated assets or FX strategies that capitalize on dollar depreciation.

5. Key Market Conditions to Monitor for Potential Regime Shifts:
   - Inflation dynamics and central bank policy shifts: Any meaningful pivot toward easing or tightening could significantly alter the current bullish regime in gold and bearish regime in USD.
   - Risk sentiment stabilization: Watch closely for signs of improving equity and bond volatility-adjusted returns, which could signal a shift back toward traditional risk assets.
   - Commodity market stabilization: The recent short-term rebound in commodities may indicate a potential regime shift; monitor closely for confirmation through sustained positive volatility-adjusted returns.
   - USD trend reversal signals: Given the extended bearish regime, any meaningful improvement in USD volatility-adjusted returns could signal a critical turning point for FX markets and global asset allocation strategies.

In summary, gold remains the standout asset on a risk-adjusted basis, while traditional risk assets and USD remain challenged. Closely monitor potential shifts in inflation, central bank policy, commodity markets, and USD dynamics to anticipate and position for regime changes.

---

## Momentum Analysis
### Data
|    | country_ref   |    equity |        fx |        vol |       rates |         eps | create_date                |
|---:|:--------------|----------:|----------:|-----------:|------------:|------------:|:---------------------------|
|  0 | China         |  1.31892  |  1.37512  | -0.922355  |  -0.705969  |   0.209223  | 2025-06-05 10:04:19.956568 |
|  1 | Singapore     |  1.83954  |  1.87539  |  0.863052  |  -2.15181   |   0.28214   | 2025-06-05 10:04:19.956568 |
|  2 | Korea         |  2.46786  |  1.94814  |  1.06403   |  -0.0634922 |   1.05883   | 2025-06-05 10:04:19.956568 |
|  3 | India         |  0.450979 |  0.684831 |  0.818944  |  -1.8281    |   1.16913   | 2025-06-05 10:04:19.956568 |
|  4 | Thailand      | -0.673936 |  1.72542  |  1.41611   |  -1.69537   |  -0.365776  | 2025-06-05 10:04:19.956568 |
|  5 | Taiwan        |  0.932542 |  1.93855  |  1.01649   | nan         |  -0.523547  | 2025-06-05 10:04:19.956568 |
|  6 | Czech         |  1.5542   |  2.13661  | -0.0479559 |   0.203665  |   1.74361   | 2025-06-05 10:04:19.956568 |
|  7 | Hungary       |  1.82582  |  2.00664  | -0.803825  |  -0.513923  |   3.21419   | 2025-06-05 10:04:19.956568 |
|  8 | Russia        | -0.119048 |  1.51529  | -0.239514  |   2.68627   | nan         | 2025-06-05 10:04:19.956568 |
|  9 | Turkey        | -0.520554 |  1.52847  |  0.710024  |  -0.523597  |  -0.124891  | 2025-06-05 10:04:19.956568 |
| 10 | South Africa  |  2.23269  |  2.00395  | -0.649609  |  -1.46801   |   1.94683   | 2025-06-05 10:04:19.956568 |
| 11 | Brazil        |  0.579472 |  2.29633  |  0.442021  |   0.305453  |  -1.25161   | 2025-06-05 10:04:19.956568 |
| 12 | Mexico        |  1.4089   |  1.93678  | -2.13758   |  -1.59102   |   0.562294  | 2025-06-05 10:04:19.956568 |
| 13 | Chile         |  0.92162  |  1.90183  | -0.0936281 |  -1.17721   |   1.55895   | 2025-06-05 10:04:19.956568 |
| 14 | Colombia      |  2.09636  |  1.98773  |  0.0033036 |   0.441476  | nan         | 2025-06-05 10:04:19.956568 |
| 15 | Poland        |  0.573948 |  1.67487  | -0.48061   |  -0.759513  |   1.11362   | 2025-06-05 10:04:19.956568 |
| 16 | Australia     |  1.80727  |  1.76212  | -0.315973  |  -1.26312   |  -0.658832  | 2025-06-05 10:04:19.956568 |
| 17 | Canada        |  1.89909  |  1.87205  |  0.0100753 |  -0.0128567 |   0.554685  | 2025-06-05 10:04:19.956568 |
| 18 | Europe        |  1.95207  |  1.92853  |  0.197615  |  -0.158841  |  -0.0842746 | 2025-06-05 10:04:19.956568 |
| 19 | Japan         |  1.05186  |  1.14352  |  0.231061  |   0.834353  |   0.555621  | 2025-06-05 10:04:19.956568 |
| 20 | New Zealand   |  1.0414   |  1.89822  | -0.544901  |  -0.508317  |  -2.04841   | 2025-06-05 10:04:19.956568 |
| 21 | Norway        |  2.24739  |  2.18124  | -0.502991  |   1.02793   |   0.0527253 | 2025-06-05 10:04:19.956568 |
| 22 | Sweden        |  1.73856  |  1.57884  | -0.223721  |  -1.60825   |   0.322211  | 2025-06-05 10:04:19.956568 |
| 23 | Switzerland   |  1.64021  |  1.50672  |  0.482923  |  -1.1132    |  -0.465302  | 2025-06-05 10:04:19.956568 |
| 24 | UK            |  1.88878  |  2.03925  | -0.130645  |  -0.281997  |  -1.69762   | 2025-06-05 10:04:19.956568 |
| 25 | US            |  1.08834  | -1.66821  | -0.252221  |  -0.818712  |   0.890183  | 2025-06-05 10:04:19.956568 |

### Analysis
Current Market Mosaic and Key Insights:

1. Three Most Significant Market Conditions:

- Broad EM FX Strength vs. USD Weakness:  
  EM currencies exhibit strong bullish momentum (e.g., Brazil FX Z-score +2.30, Czech Republic +2.14, South Africa +2.00, Hungary +2.01), while the US dollar shows significant bearish momentum (FX Z-score -1.67). This indicates a clear rotation away from USD into higher-beta EM currencies, driven by improving risk sentiment, attractive carry dynamics, and relative growth/inflation expectations.

- Divergence Between Equities and Earnings Expectations:  
  Several markets show notable divergences between equity momentum and EPS expectations. For example, Thailand equities are negative (-0.67) despite strong FX momentum (+1.73), while EPS expectations remain weak (-0.37). Similarly, UK equities remain strong (+1.89) despite sharply negative EPS momentum (-1.70). These divergences suggest potential dislocations where either equities or earnings expectations must realign, creating alpha opportunities.

- Rates Momentum Divergence and Inflation Expectations:  
  Russia (+2.69), Norway (+1.03), and Japan (+0.83) show positive rates momentum, indicating rising yields and potentially accelerating inflation expectations. Conversely, significant negative rates momentum in Singapore (-2.15), India (-1.83), Thailand (-1.70), and Mexico (-1.59) suggests easing inflation expectations or dovish monetary policy outlooks. These divergences highlight clear differentiation in monetary policy trajectories and inflation dynamics across regions.

2. Regions/Asset Classes Showing Strongest Directional Positioning:

- FX Strength:  
  Strongest bullish momentum in EM FX: Brazil (+2.30), Czech Republic (+2.14), Norway (+2.18), South Africa (+2.00), Hungary (+2.01), Colombia (+1.99).  
  Strongest bearish momentum: USD (-1.67).

- Equity Strength:  
  Strongest equity momentum: Korea (+2.47), Norway (+2.25), South Africa (+2.23), Colombia (+2.10), Europe (+1.95), Canada (+1.90), UK (+1.89).  
  Weakest equity momentum: Thailand (-0.67), Turkey (-0.52), Russia (-0.12).

3. Notable Divergences and Potential Dislocations:

- US Divergence:  
  US equities (+1.09) remain moderately positive, yet FX momentum is sharply negative (-1.67). This divergence suggests investors are reallocating capital out of USD-denominated assets into international markets, potentially driven by relative growth and yield differentials.

- Thailand Divergence:  
  Strong FX momentum (+1.73) contrasts sharply with negative equity (-0.67) and EPS momentum (-0.37). This suggests FX strength driven by external flows and carry rather than domestic fundamentals, creating potential dislocation.

- UK Divergence:  
  Strong equity (+1.89) and FX momentum (+2.04) despite significantly negative EPS momentum (-1.70). This divergence suggests market optimism may be vulnerable if earnings expectations fail to recover, creating potential downside risk.

4. Actionable Insights from Current Conditions:

- EM FX and equity markets currently exhibit strong bullish momentum, supported by attractive carry, improving growth outlooks, and rotation away from USD. These conditions favor continued EM outperformance in the near term.

- Markets with significant divergences between equity and EPS momentum (UK, Thailand, Brazil, Australia) should be closely monitored for potential reversion or realignment, providing opportunities for alpha generation.

- US dollar weakness is pronounced and broad-based, reflecting relative growth and yield dynamics favoring international markets. This trend is likely to persist absent a meaningful shift in US economic or monetary policy outlook.

5. Key Market Dynamics to Monitor for Potential Regime Shifts:

- US Monetary Policy and Inflation Dynamics:  
  Monitor closely for signals of a shift in Fed policy stance or inflation trajectory, which could rapidly reverse current USD bearish momentum and impact global risk sentiment.

- EM Inflation and Rates Trajectories:  
  Watch closely for signs of accelerating inflation or policy tightening in EM economies (especially Brazil, Hungary, Czech Republic, South Africa), which could reinforce FX strength or trigger volatility if tightening expectations overshoot.

- Earnings Momentum Realignment:  
  Monitor closely markets with significant equity/EPS divergences (UK, Thailand, Australia, Brazil). A realignment in earnings expectations could trigger sharp reversals or accelerations in equity momentum.

6. Current Mosaic Summary:

The current market mosaic is characterized by pronounced USD weakness and broad-based bullish momentum in EM currencies and equities, supported by favorable carry dynamics, improving global growth sentiment, and differentiated inflation/rates trajectories. Notable divergences between equity and EPS momentum in select markets (UK, Thailand, Australia, Brazil) highlight potential dislocations and alpha opportunities. The US market exhibits a clear divergence between stable equity momentum and sharply negative FX momentum, reflecting investor rotation into international markets. Key dynamics to monitor closely include US monetary policy signals, EM inflation trajectories, and earnings momentum realignment. Overall, the current regime favors continued EM outperformance and USD weakness, with selective opportunities arising from identified divergences and dislocations.

---

## Regional Analysis
### Data
|    | ticker                      |        30 |       90 |      360 |   blended | simple_name               | region_report   |   blended_abs |   rank | create_date                |
|---:|:----------------------------|----------:|---------:|---------:|----------:|:--------------------------|:----------------|--------------:|-------:|:---------------------------|
|  0 | slv us equity               |  3.18715  |  2.75706 |  2.72209 |   2.88877 | Silver                    | Americas        |       2.88877 |      1 | 2025-06-05 10:04:21.379575 |
|  1 | brlusdtl curncy             |  2.64399  |  1.91331 |  2.33169 |   2.29633 | Brazil FX                 | Americas        |       2.29633 |      2 | 2025-06-05 10:04:21.379575 |
|  2 | xme us equity               |  2.90178  |  2.52267 |  1.23186 |   2.21877 | Metals                    | Americas        |       2.21877 |      3 | 2025-06-05 10:04:21.379575 |
|  3 | gxg us equity               |  1.94554  |  1.85009 |  2.49346 |   2.09636 | Colombia Stocks           | Americas        |       2.09636 |      4 | 2025-06-05 10:04:21.379575 |
|  4 | mxnusdtl curncy             |  1.80108  |  1.64862 |  2.36063 |   1.93678 | Mexico FX                 | Americas        |       1.93678 |      5 | 2025-06-05 10:04:21.379575 |
|  5 | clpusdtl curncy             |  2.83374  |  1.18113 |  1.69062 |   1.90183 | Chile FX                  | Americas        |       1.90183 |      6 | 2025-06-05 10:04:21.379575 |
|  6 | uup us equity               | -1.73602  | -1.28428 | -1.92941 |  -1.6499  | Dollar Index              | Americas        |       1.6499  |      7 | 2025-06-05 10:04:21.379575 |
|  7 | qmnix us equity             |  0.988551 |  1.64773 |  2.23665 |   1.62431 | AQR Style Factors         | Americas        |       1.62431 |      8 | 2025-06-05 10:04:21.379575 |
|  8 | gmxn02yr index              | -1.72553  | -1.2999  | -1.74763 |  -1.59102 | Mexico 2 Year             | Americas        |       1.59102 |      9 | 2025-06-05 10:04:21.379575 |
|  9 | gld us equity               |  1.3263   |  1.25754 |  2.07752 |   1.55379 | Gold                      | Americas        |       1.55379 |     10 | 2025-06-05 10:04:21.379575 |
| 10 | co1 comdty/cl1 comdty       | -2.62785  | -3.07269 | -2.23592 |  -2.64549 | Brent/WTI                 | Europe          |       2.64549 |     11 | 2025-06-05 10:04:21.379575 |
| 11 | enor us equity              |  1.68364  |  1.84121 |  3.21731 |   2.24739 | Norway Stocks             | Europe          |       2.24739 |     12 | 2025-06-05 10:04:21.379575 |
| 12 | mxeu0ad index               |  1.6155   |  2.08023 |  2.70101 |   2.13225 | Europe Defense Index      | Europe          |       2.13225 |     13 | 2025-06-05 10:04:21.379575 |
| 13 | ewg us equity               |  1.98291  |  1.70521 |  2.55384 |   2.08065 | German Stocks             | Europe          |       2.08065 |     14 | 2025-06-05 10:04:21.379575 |
| 14 | eurtrytl curncy             |  2.1449   |  1.62029 |  2.46322 |   2.07613 | EURTRY                    | Europe          |       2.07613 |     15 | 2025-06-05 10:04:21.379575 |
| 15 | mxeu0ad index/beutrav index |  1.8991   |  2.14465 |  2.1395  |   2.06108 | Europe Defense vs Tourism | Europe          |       2.06108 |     16 | 2025-06-05 10:04:21.379575 |
| 16 | vgk us equity               |  1.57494  |  1.58741 |  2.69386 |   1.95207 | Europe Stocks             | Europe          |       1.95207 |     17 | 2025-06-05 10:04:21.379575 |
| 17 | eurusdtl curncy             |  2.01363  |  1.44777 |  2.32418 |   1.92853 | Europe FX                 | Europe          |       1.92853 |     18 | 2025-06-05 10:04:21.379575 |
| 18 | ewu us equity               |  1.35638  |  1.62423 |  2.68575 |   1.88878 | UK Stocks                 | Europe          |       1.88878 |     19 | 2025-06-05 10:04:21.379575 |
| 19 | m7eusc index                |  1.21219  |  1.40793 |  2.75609 |   1.79207 | Europe Small Cap          | Europe          |       1.79207 |     20 | 2025-06-05 10:04:21.379575 |
| 20 | kospi index                 |  2.85235  |  2.77663 |  1.9273  |   2.51876 | Korea Equities            | Asia            |       2.51876 |     21 | 2025-06-05 10:04:21.379575 |
| 21 | hg1 comdty                  |  2.99836  |  1.28776 |  2.19486 |   2.16033 | Copper                    | Asia            |       2.16033 |     22 | 2025-06-05 10:04:21.379575 |
| 22 | bpraero index               |  1.56329  |  1.92865 |  2.34024 |   1.94406 | Asia Defense Index        | Asia            |       1.94406 |     23 | 2025-06-05 10:04:21.379575 |
| 23 | nzdusdtl curncy             |  2.35084  |  1.73245 |  1.61136 |   1.89822 | New Zealand FX            | Asia            |       1.89822 |     24 | 2025-06-05 10:04:21.379575 |
| 24 | sgdusdtl curncy             |  1.61795  |  1.60697 |  2.40124 |   1.87539 | Singapore FX              | Asia            |       1.87539 |     25 | 2025-06-05 10:04:21.379575 |
| 25 | as51 index                  |  2.04278  |  1.84163 |  1.70533 |   1.86325 | Australia Equities        | Asia            |       1.86325 |     26 | 2025-06-05 10:04:21.379575 |
| 26 | ecns us equity              |  2.07061  |  1.62424 |  1.84458 |   1.84648 | China Small Cap           | Asia            |       1.84648 |     27 | 2025-06-05 10:04:21.379575 |
| 27 | ewa us equity               |  2.26525  |  1.7603  |  1.39627 |   1.80727 | Australia Stocks          | Asia            |       1.80727 |     28 | 2025-06-05 10:04:21.379575 |
| 28 | audusdtl cmpn curncy        |  2.42304  |  1.6783  |  1.18501 |   1.76212 | Aussie Dollar             | Asia            |       1.76212 |     29 | 2025-06-05 10:04:21.379575 |
| 29 | aaxj us equity              |  1.66725  |  1.50861 |  2.02196 |   1.73261 | Asia Ex Japan             | Asia            |       1.73261 |     30 | 2025-06-05 10:04:21.379575 |
| 30 | slv us equity               |  3.18715  |  2.75706 |  2.72209 |   2.88877 | Silver                    | Overall         |       2.88877 |     31 | 2025-06-05 10:04:21.379575 |
| 31 | co1 comdty/cl1 comdty       | -2.62785  | -3.07269 | -2.23592 |  -2.64549 | Brent/WTI                 | Overall         |       2.64549 |     32 | 2025-06-05 10:04:21.379575 |
| 32 | kospi index                 |  2.85235  |  2.77663 |  1.9273  |   2.51876 | Korea Equities            | Overall         |       2.51876 |     33 | 2025-06-05 10:04:21.379575 |
| 33 | brlusdtl curncy             |  2.64399  |  1.91331 |  2.33169 |   2.29633 | Brazil FX                 | Overall         |       2.29633 |     34 | 2025-06-05 10:04:21.379575 |
| 34 | enor us equity              |  1.68364  |  1.84121 |  3.21731 |   2.24739 | Norway Stocks             | Overall         |       2.24739 |     35 | 2025-06-05 10:04:21.379575 |
| 35 | xme us equity               |  2.90178  |  2.52267 |  1.23186 |   2.21877 | Metals                    | Overall         |       2.21877 |     36 | 2025-06-05 10:04:21.379575 |
| 36 | hg1 comdty                  |  2.99836  |  1.28776 |  2.19486 |   2.16033 | Copper                    | Overall         |       2.16033 |     37 | 2025-06-05 10:04:21.379575 |
| 37 | mxeu0ad index               |  1.6155   |  2.08023 |  2.70101 |   2.13225 | Europe Defense Index      | Overall         |       2.13225 |     38 | 2025-06-05 10:04:21.379575 |
| 38 | gxg us equity               |  1.94554  |  1.85009 |  2.49346 |   2.09636 | Colombia Stocks           | Overall         |       2.09636 |     39 | 2025-06-05 10:04:21.379575 |
| 39 | ewg us equity               |  1.98291  |  1.70521 |  2.55384 |   2.08065 | German Stocks             | Overall         |       2.08065 |     40 | 2025-06-05 10:04:21.379575 |

### Analysis
Current Mosaic and Key Regional Conditions:

1. Significant Regional Conditions and Dislocations:

- Commodities Divergence:  
  Silver (blended z-score: +2.89) and Metals (XME, +2.22) in the Americas, along with Copper (+2.16, Asia), are showing exceptional strength. Conversely, Brent/WTI crude oil (Europe, -2.65) is notably weak. This divergence indicates a clear rotation within commodities—away from energy and toward industrial and precious metals. The implication is bullish for metals-linked economies and currencies (e.g., Chile FX, +1.90), and bearish for energy-dependent markets.

- Asia Equities Outperformance:  
  Korea equities (KOSPI, +2.52) are significantly outperforming, alongside strength in Australia equities (AS51, +1.86; EWA, +1.81) and China small caps (ECNS, +1.85). This broad-based strength across Asia suggests improving regional economic momentum, likely driven by positive growth expectations, supportive monetary policy conditions, and improving investor sentiment toward Asian risk assets.

- Dollar Weakness and EM FX Strength:  
  The Dollar Index (UUP, -1.65) shows clear weakness. Simultaneously, EM currencies in the Americas—Brazil FX (+2.30), Mexico FX (+1.94), Chile FX (+1.90)—are notably strong. This FX dynamic indicates robust growth and inflation expectations in Latin America, combined with a dovish or neutral Fed outlook, supporting EM carry trades and risk appetite.

2. Regions Showing Unusual Strength or Weakness:

- Unusual Strength:  
  Latin America FX (Brazil, Mexico, Chile) is notably strong, reflecting elevated inflation expectations, stable credit conditions, and attractive carry dynamics. Korea equities are also significantly outperforming expectations, indicating strong cyclical growth momentum in Asia.

- Unusual Weakness:  
  Energy commodities (Brent/WTI) are notably weak, suggesting either oversupply conditions or weakening global demand expectations. This weakness contrasts sharply with broader commodity strength, highlighting a specific dislocation in the energy complex.

3. Connection to Broader Macro Themes:

- Monetary Policy Divergence:  
  The pronounced weakness in the Dollar Index and strength in EM FX suggests markets anticipate a dovish or neutral Fed stance, contrasting with tighter monetary conditions or elevated inflation expectations in EM economies. This divergence supports EM currencies and risk assets broadly.

- Global Growth Rotation:  
  Strength in industrial metals (Copper, Silver, XME) and Asian equities indicates improving global manufacturing and industrial activity, particularly in Asia. Weakness in energy commodities suggests a structural shift toward non-energy commodities and possibly reflects decarbonization trends or efficiency gains.

- Fiscal and Geopolitical Dynamics:  
  Europe Defense Index (+2.13) and Europe Defense vs Tourism (+2.06) indicate persistent geopolitical tensions and elevated defense spending in Europe. This aligns with ongoing geopolitical uncertainty, supporting defense-related sectors and potentially weighing on cyclical tourism sectors.

4. Current Market Mosaic ("Market in Front of You"):

The current mosaic is characterized by:

- Clear rotation away from energy commodities toward industrial and precious metals, reflecting improving industrial demand and possibly structural shifts in global energy consumption.
- Sustained weakness in the US dollar, supporting EM FX and risk appetite broadly, driven by expectations of a dovish or neutral Fed stance.
- Strong regional equity performance in Asia (particularly Korea and Australia), suggesting improving cyclical growth momentum and investor confidence in Asian economic recovery.
- Persistent geopolitical tensions in Europe, supporting defense sectors and indicating ongoing caution toward cyclical European sectors.

Notable Regional Rotation and Relative Value Opportunities:

- Rotation from Energy to Industrial Commodities:  
  The sharp divergence between weak energy commodities and strong industrial metals suggests relative value opportunities favoring industrial metals-linked markets (e.g., Chile FX, Australia equities) over energy exporters (e.g., Norway equities, despite current strength, may face headwinds if oil weakness persists).

- EM FX Strength vs USD Weakness:  
  Continued strength in Latin American currencies versus USD weakness highlights attractive carry dynamics and growth differentials. This suggests relative value opportunities favoring EM FX exposure, particularly Brazil and Mexico, against USD-denominated assets.

- Asia Equities Outperformance vs Global Peers:  
  Strong outperformance in Korea and Australia equities relative to broader global indices (Europe, US) indicates investor rotation toward Asian cyclical growth. Relative value positioning favoring Asian equities versus European cyclical sectors (e.g., tourism, consumer discretionary) may offer attractive risk-reward.

Bottom Line:

The market in front of you is defined by clear commodity rotation, pronounced USD weakness supporting EM FX, and robust Asian equity performance. These dynamics reflect improving global industrial demand, dovish Fed expectations, and regional growth divergence. Portfolio positioning should consider these clear regional dislocations and relative value opportunities to capitalize on the current macro regime.

---

## Corestats Analysis
### Data
|    | country      |   equity_pe_ratio |   5y_yield |          erp |       growth |    ppp_pctp | create_date                | apple_product_ref   |
|---:|:-------------|------------------:|-----------:|-------------:|-------------:|------------:|:---------------------------|:--------------------|
|  0 | Russia       |         nan       |  0.1721    | nan          | nan          | -0.803554   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
|  1 | South Africa |          11.3202  |  0.0738    |   0.0145376  |   0.0631034  | -0.49501    | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
|  2 | Taiwan       |          16.132   |  0.0143    |   0.0476884  |   0.111775   | -0.404231   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
|  3 | India        |          22.1295  |  0.0588    |  -0.0136115  |   0.0720791  | -0.402931   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
|  4 | Japan        |          18.2762  |  0.0102    |   0.044516   |   0.0386906  | -0.299014   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
|  5 | China        |          13.0321  |  0.01475   |   0.0619835  |   0.0722316  | -0.264486   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
|  6 | Korea        |          10.0441  |  0.02597   |   0.0735912  |   0.0548789  | -0.206007   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
|  7 | Thailand     |          13.5925  |  0.0153579 |   0.0582123  |   0.0269681  | -0.193392   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
|  8 | Hungary      |           6.86234 |  0.056829  |   0.0888939  |   0.00565682 | -0.157657   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
|  9 | Australia    |          19.2563  |  0.035369  |   0.016562   |   0.0396866  | -0.0785837  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 10 | Turkey       |           3.95388 |  0.3823    |  -0.129384   |   0.285944   | -0.0778349  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 11 | Colombia     |         nan       |  0.11217   | nan          | nan          | -0.0771186  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 12 | Chile        |          11.9689  |  0.0464    |   0.03715    |   0.078272   | -0.0595789  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 13 | Europe       |          15.6754  |  0.02142   |   0.0423743  |   0.0418361  | -0.0562957  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 14 | Mexico       |          12.4837  |  0.0862    |  -0.00609555 |   0.0527929  | -0.0545312  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 15 | New Zealand  |          28.8919  |  0.0387    |  -0.00408828 |   0.0344431  | -0.0538181  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 16 | Brazil       |           8.33332 |  0.13776   |  -0.0177598  |   0.0510173  | -0.0506606  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 17 | Czech        |          11.7323  |  0.030212  |   0.0550228  |   0.0639473  | -0.0216274  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 18 | Singapore    |          12.4575  |  0.01986   |   0.0604127  |   0.0447147  | -0.0137197  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 19 | Canada       |          16.6132  |  0.02856   |   0.031633   |   0.0557963  | -0.00667756 | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 20 | US           |          23.0256  |  0.03925   |   0.00417985 |   0.0604151  |  0          | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 21 | Poland       |           9.56374 |  0.05023   |   0.0543316  |   0.0225706  |  0.0560949  | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 22 | UK           |          13.6567  |  0.04098   |   0.0322442  |   0.0370784  |  0.134344   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 23 | Sweden       |          18.2111  |  0.02299   |   0.0319215  |   0.0422108  |  0.199809   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 24 | Norway       |          12.4708  |  0.03959   |   0.0405975  |   0.00960957 |  0.317963   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |
| 25 | Switzerland  |          18.0626  |  0.00012   |   0.055243   |   0.0364918  |  0.461373   | 2025-06-05 10:05:26.626278 | ipad__ipad-pro      |

### Analysis
1. Three Most Significant Valuation Anomalies or Fundamental Dislocations:

- Turkey: Extreme valuation anomaly with equity PE at 3.95, very high 5-year yield at 38.23%, negative ERP (-12.94%), yet exceptionally high growth expectations (28.59%). This indicates severe market skepticism around sustainability of growth and significant credit risk concerns, despite attractive headline valuations.
  
- Hungary: Equity PE at 6.86, elevated 5-year yield at 5.68%, and an extremely high ERP of 8.89%, yet negligible growth expectations (0.57%). This suggests the market is pricing significant risk premium without corresponding growth, indicating potential mispricing or overly pessimistic sentiment.

- New Zealand: Equity PE at 28.89 (highest in the dataset), negative ERP (-0.41%), moderate yield (3.87%), and modest growth (3.44%). This combination of stretched valuations, negative ERP, and modest growth expectations signals potential overvaluation and vulnerability to mean reversion.

2. Countries/Regions with Most Attractive Risk/Reward Profiles:

- Korea: Attractive valuation with equity PE at 10.04, robust ERP (7.36%), moderate yield (2.60%), and solid growth expectations (5.49%). This combination suggests undervaluation relative to fundamentals, providing a favorable risk/reward profile.

- China: Equity PE at 13.03, strong ERP (6.20%), low yield (1.48%), and healthy growth expectations (7.22%). Given the relatively low valuation and positive growth outlook, China appears fundamentally attractive.

- Chile: Equity PE at 11.97, solid ERP (3.72%), moderate yield (4.64%), and decent growth expectations (7.83%). This combination suggests attractive valuation and potential for positive repricing.

3. Comparison to Historical Norms and Implications:

- Turkey's extreme yield (38.23%) and ultra-low PE (3.95) are significantly outside historical norms, reflecting severe market stress and pricing in substantial credit/default risk. Historically, such extremes tend to revert once policy credibility or macro stability improves, but timing is uncertain.

- New Zealand's PE ratio (28.89) is historically elevated, particularly given modest growth expectations (3.44%) and negative ERP. Historically, such stretched valuations without fundamental support tend to revert downward.

- Hungary's ERP (8.89%) and PE (6.86) are historically anomalous, indicating excessive pessimism. Historically, such extreme risk premiums without fundamental deterioration often revert positively once investor sentiment stabilizes.

4. Current Mosaic – "The Market in Front of You":

The current macro mosaic indicates clear bifurcation between emerging markets with extreme valuation anomalies (Turkey, Hungary) and developed markets with stretched valuations (New Zealand, US). Investors are pricing significant credit risk and macro instability in Turkey, while Hungary appears excessively discounted without clear fundamental deterioration. Developed markets such as New Zealand and the US exhibit elevated valuations, modest ERP, and moderate growth, suggesting vulnerability to valuation-driven corrections.

Asian markets (Korea, China, Taiwan) stand out positively, with attractive valuations, strong ERP, and robust growth expectations. This divergence suggests investors remain cautious toward EM ex-Asia, while selectively positive on Asian economies.

Currency valuations (PPP deviations) indicate Switzerland (46.14% overvaluation), Norway (31.80%), and Sweden (19.98%) as significantly overvalued, reflecting safe-haven and stability premiums. Conversely, Russia (-80.36%), South Africa (-49.50%), and Taiwan (-40.42%) currencies appear significantly undervalued, reflecting geopolitical and macroeconomic risk premiums.

5. Key Economic Factors Driving Mean Reversion or Trend Continuation:

- Turkey: Policy credibility, inflation stabilization, and credit risk mitigation are critical. Improvement could trigger sharp positive mean reversion in valuations; further deterioration would exacerbate current extremes.

- Hungary: Sentiment stabilization and improved EU economic outlook could drive positive mean reversion in ERP and valuation. Conversely, worsening EU macro conditions or local policy missteps could sustain current pessimism.

- New Zealand: Valuation normalization likely if growth disappoints or global risk appetite declines. Continued global liquidity and risk-on sentiment could sustain current stretched valuations temporarily.

- Asia (Korea, China, Taiwan): Continued robust growth, stable inflation, and supportive monetary policy could sustain positive valuation trends. Geopolitical tensions or significant global trade disruptions would pose downside risks.

In summary, the current macro mosaic highlights significant valuation dislocations, particularly in Turkey, Hungary, and New Zealand. Asian markets offer attractive fundamental profiles, while developed markets appear stretched. Currency valuations reflect clear safe-haven premiums and EM risk discounts. Portfolio positioning should carefully consider these fundamental divergences and potential catalysts for mean reversion or trend continuation.

---

## Correl Analysis
### Data
|    | asset   |       S&P |        30Y |        GLD |        COM |        USD |        BTC | create_date                |
|---:|:--------|----------:|-----------:|-----------:|-----------:|-----------:|-----------:|:---------------------------|
|  0 | S&P     | 1         |  0.103237  |  0.0573405 |  0.499228  |  0.229045  |  0.452929  | 2025-06-05 10:04:10.489181 |
|  1 | 30Y     | 0.103237  |  1         |  0.049992  | -0.0024969 | -0.0537471 | -0.0555389 | 2025-06-05 10:04:10.489181 |
|  2 | GLD     | 0.0573405 |  0.049992  |  1         |  0.415784  | -0.567952  |  0.017479  | 2025-06-05 10:04:10.489181 |
|  3 | COM     | 0.499228  | -0.0024969 |  0.415784  |  1         | -0.0293817 |  0.265889  | 2025-06-05 10:04:10.489181 |
|  4 | USD     | 0.229045  | -0.0537471 | -0.567952  | -0.0293817 |  1         |  0.139297  | 2025-06-05 10:04:10.489181 |
|  5 | BTC     | 0.452929  | -0.0555389 |  0.017479  |  0.265889  |  0.139297  |  1         | 2025-06-05 10:04:10.489181 |

### Analysis
Current Mosaic:

The market is currently characterized by a clear reflationary tilt, evidenced by strong positive correlations between equities (S&P), commodities (COM), and Bitcoin (BTC). The USD is notably weakly correlated with commodities and negatively correlated with gold (GLD), suggesting a market environment where dollar strength is not a primary driver, and gold is trading primarily as an anti-dollar asset rather than a pure risk-off hedge. Meanwhile, the 30-year treasury bond (30Y) is largely uncorrelated with risk assets, underscoring a breakdown in the traditional equity-bond relationship. Bitcoin is trading more like a risk-on asset, closely aligned with equities and commodities, rather than a digital gold substitute.

Three Most Significant Correlation Patterns and Implications:

1. Strong Positive Correlation between S&P and Commodities (0.499):
   - Implication: Equities and commodities are trading in lockstep, reflecting a reflationary, pro-cyclical market environment. Commodities are not acting as a diversifier but rather as a beta amplifier to equity risk. Portfolio managers should be cautious about overweighting commodities as a hedge and instead treat them as a leveraged cyclical exposure.

2. Strong Negative Correlation between USD and GLD (-0.568):
   - Implication: Gold is currently trading predominantly as an anti-dollar asset rather than a safe-haven hedge. Dollar weakness is directly translating into gold strength. This suggests that gold exposure is primarily a currency bet at this stage, and portfolio managers should consider gold allocations in the context of their USD outlook rather than as a pure risk-off hedge.

3. Elevated Positive Correlation between S&P and BTC (0.453):
   - Implication: Bitcoin is increasingly trading as a risk-on asset, closely aligned with equities and commodities. Its diversification benefits are currently limited. Portfolio managers should treat BTC as a high-beta risk asset rather than a diversifier or safe-haven alternative.

Traditional Relationships Breaking Down or Strengthening:

- Breakdown: Bonds (30Y) and Equities (S&P) correlation (0.103) is unusually weak, signaling a breakdown in the traditional negative correlation between bonds and equities. Bonds are currently not providing meaningful diversification benefits against equity risk, suggesting a potential regime shift where bonds are trading independently from risk sentiment.
- Strengthening: Commodities and Equities correlation (0.499) is notably strong, reinforcing the reflationary narrative and cyclical alignment between these two asset classes.

Opportunities for Diversification or Relative Value Positions:

- Diversification Opportunity: Given the breakdown in the bond-equity relationship, portfolio managers should seek alternative sources of diversification beyond traditional bonds. The current low correlation of the 30Y bond with equities and commodities suggests bonds are trading on idiosyncratic factors (likely monetary policy expectations and inflation dynamics), potentially offering tactical diversification if these idiosyncratic drivers diverge further from risk assets.
- Relative Value Opportunity: The strong negative correlation between USD and GLD (-0.568) suggests clear relative value opportunities in FX versus gold. Managers with a strong USD view can exploit this tight inverse relationship directly, positioning gold exposure as a leveraged anti-dollar trade.
- Relative Value Opportunity: Bitcoin's high correlation to equities and commodities (0.453 and 0.266 respectively) suggests BTC is currently priced as a leveraged cyclical asset. Managers looking for high-beta cyclical exposure can consider BTC as a tactical substitute or complement to traditional cyclical assets.

Assets Showing Unusual Correlation Behavior:

- 30Y Bond: The near-zero correlation with equities (0.103) and commodities (-0.002) is unusual, signaling a regime shift where bond prices are driven predominantly by idiosyncratic monetary policy and inflation expectations rather than traditional risk-on/risk-off dynamics. This creates potential inefficiencies and tactical opportunities in bond positioning.
- Gold (GLD): Gold's strong negative correlation with USD (-0.568) and limited correlation with equities (0.057) indicates it is trading primarily as an FX proxy rather than a safe-haven asset. This unusual behavior suggests potential mispricing opportunities if market participants incorrectly position gold as a risk-off hedge.

Bottom Line:

The current mosaic clearly indicates a reflationary, pro-cyclical market environment, with equities, commodities, and Bitcoin trading in tandem. Traditional diversification via bonds is currently limited, and gold is primarily an anti-dollar trade. Portfolio managers should position accordingly, treating commodities and Bitcoin as leveraged cyclical exposures, gold as a currency proxy, and bonds as idiosyncratic tactical opportunities rather than traditional diversifiers.

---

## Overall Market Conclusion
Dominant Macro Regime:

The dominant macro regime is clearly reflationary. The mosaic strongly supports this conclusion given the synchronized strength across cyclical commodities (industrial metals, silver, copper), robust EM FX performance, pronounced USD weakness, and the strong positive correlation between equities, commodities, and Bitcoin. The breakdown in traditional bond-equity correlations further emphasizes that markets are pricing in a reflationary environment driven by improving global growth expectations, elevated inflation dynamics, and a dovish-to-neutral Fed stance.

Largest Trends Consistent Across Asset Classes:

1. Pronounced USD Weakness:
   - USD volatility-weighted returns are consistently negative across all timeframes (-21.80% at 6M, -18.65% at 12M).
   - EM FX strength (Brazil +2.30, Czech Republic +2.14, South Africa +2.00, Hungary +2.01) clearly indicates capital rotation away from USD into higher-beta EM currencies.
   - Gold's strong negative correlation with USD (-0.568) further confirms the bearish dollar regime.

2. Strong EM FX and Equity Momentum:
   - EM FX and equities exhibit robust bullish momentum, especially in Latin America (Brazil, Mexico, Chile) and Asia (Korea, Australia, China small caps). This reflects attractive carry dynamics, improving growth expectations, and investor rotation toward cyclical, higher-beta regions.

3. Commodity Rotation Toward Industrial and Precious Metals:
   - Significant strength in silver (+2.89), industrial metals (XME +2.22), and copper (+2.16) contrasts sharply with weakness in energy commodities (Brent/WTI -2.65). This rotation indicates improving global industrial demand and structural shifts favoring non-energy commodities.

4. Breakdown of Traditional Diversification:
   - Bonds (30Y) exhibit minimal correlation with equities (0.103) and commodities (-0.002), signaling a regime shift where bonds are driven by idiosyncratic monetary policy and inflation expectations rather than traditional risk-off dynamics.

Largest Dislocations or Contradictory Patterns:

1. Equity vs Earnings Momentum Divergences:
   - UK equities (+1.89) and FX (+2.04) remain strong despite sharply negative EPS momentum (-1.70). Similarly, Thailand equities (-0.67) diverge negatively from strong FX momentum (+1.73). These divergences suggest markets are pricing in optimistic growth scenarios that are not yet reflected in earnings expectations, creating potential dislocations.

2. Valuation Extremes in Select Markets:
   - Turkey presents extreme valuation anomalies (PE 3.95, yield 38.23%, negative ERP -12.94%) despite high growth expectations (28.59%), indicating severe skepticism around sustainability and credit risk.
   - New Zealand's stretched valuations (PE 28.89, negative ERP -0.41%) contrast modest growth expectations (3.44%), signaling potential vulnerability to mean reversion.

3. Commodity Sector Divergence:
   - Sharp divergence between industrial metals strength and energy commodities weakness suggests conflicting signals regarding global demand expectations. Either industrial metals are overly optimistic, or energy commodities are overly pessimistic, creating potential relative value opportunities.

Second-Order Thinking to Understand the Mosaic:

The current reflationary regime is primarily driven by market expectations of sustained global growth recovery, dovish-to-neutral Fed policy, and elevated inflation dynamics. However, beneath this surface-level reflation narrative, there are significant second-order implications:

1. USD Weakness as a Structural Driver:
   - The pronounced bearish dollar regime is not merely cyclical—it reflects structural shifts in relative growth, yield differentials, and global capital flows. This structural USD weakness amplifies EM FX and commodity strength, reinforcing the reflationary environment. Any meaningful reversal in USD sentiment, driven by unexpected Fed hawkishness or US economic outperformance, would rapidly disrupt current trends.

2. Commodities Rotation Reflects Structural Shifts:
   - The rotation away from energy toward industrial and precious metals may reflect deeper structural shifts, including global decarbonization, ESG mandates, and changing industrial demand patterns. This suggests the commodity rotation is not purely cyclical but also structural, potentially persisting beyond typical cyclical horizons.

3. Breakdown in Bond-Equity Correlation as a Regime Shift:
   - The traditional negative correlation between bonds and equities breaking down indicates markets are repricing bonds as idiosyncratic assets driven by inflation and monetary policy expectations rather than pure risk-off hedges. This regime shift implies bonds may no longer reliably hedge equity risk, forcing portfolio managers to seek alternative diversification strategies.

4. Divergences as Early Warning Signals:
   - Equity vs earnings momentum divergences (UK, Thailand) and valuation extremes (Turkey, New Zealand) highlight underlying fragilities. Markets are currently pricing optimistic scenarios not yet supported by fundamentals, creating vulnerability to sharp repricing if growth or earnings disappoint.

Gap Risks to Monitor Closely:

1. USD Reversal Risk:
   - Given the extended bearish USD positioning, any unexpected hawkish pivot by the Fed or upside surprise in US economic data could trigger rapid USD short-covering, sharply reversing EM FX and commodity strength. Monitor Fed communications and US inflation/employment data closely.

2. Earnings Momentum Realignment:
   - Significant divergences between equity and EPS momentum (UK, Thailand, Australia, Brazil) pose gap risks if earnings fail to recover as markets currently anticipate. Earnings disappointments could trigger abrupt equity corrections in these markets.

3. Commodity Sector Realignment:
   - The sharp divergence between industrial metals and energy commodities creates gap risk if global demand expectations realign negatively. A downside surprise in global industrial activity or manufacturing PMIs could rapidly reverse industrial metals' outperformance.

4. EM Inflation and Monetary Policy Overshoot:
   - EM FX strength is partially driven by elevated inflation expectations and attractive carry dynamics. However, if EM central banks overshoot tightening expectations or inflation accelerates uncontrollably, EM FX strength could rapidly reverse, triggering volatility and capital outflows.

Bottom Line—The Market in Front of You:

The current market environment is unequivocally reflationary, characterized by pronounced USD weakness, robust EM FX and equity momentum, and clear commodity rotation toward industrial and precious metals. Traditional diversification via bonds has broken down, and gold trades primarily as an anti-dollar proxy. Beneath this reflationary surface, significant divergences and valuation extremes highlight potential fragilities and gap risks. Portfolio managers should closely monitor USD sentiment, earnings momentum realignment, commodity sector divergences, and EM inflation dynamics for early signals of regime shifts or rapid repricing events.

The mosaic clearly indicates a market environment that rewards tactical positioning aligned with reflationary dynamics, while remaining vigilant to underlying fragilities and gap risks. Trade the market in front of you—recognizing both the powerful reflationary tailwinds and the critical dislocations that could rapidly shift market regimes.


<div style="height: 30vh">  
    <script 
        src="https://cdn.jsdelivr.net/ghost/signup-form@~0.2/umd/signup-form.min.js" 
        data-background-color="#2B2B2B"    
        data-text-color="#ffffff"
        data-button-color="#2d2d2d"       
        data-button-text-color="#ffffff"
        data-title="goodalexander" 
        data-description="Navigating the Post Fiat reality" 
        data-site="https://goodalexander.ghost.io/" 
        data-locale="en" 
        async>
    </script>
</div>
