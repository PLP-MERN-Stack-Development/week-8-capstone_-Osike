export const mockChatResponse = async (userInput: string, language: string = 'en'): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const input = userInput.toLowerCase();

  // Constitution-related queries
  if (input.includes('article 27') || input.includes('equality') || input.includes('discrimination')) {
    if (language === 'sw') {
      return `Kifungu cha 27 cha Katiba kinahakikisha usawa na uhuru kutoka ubaguzi. Mambo muhimu:

• Kila mtu ni sawa mbele ya sheria
• Wanawake na wanaume wana haki ya kupata muamala sawa
• Serikali haiwezi kubagua kwa sababu ya rangi, jinsia, ujauzito, hali ya ndoa, hali ya afya, asili ya kikabila, rangi, umri, ulemavu, dini, au sababu zingine
• Hii ni pamoja na fursa sawa katika nyanja za kisiasa, kiuchumi, kitamaduni na kijamii

Ikiwa unaamini umebaguliwa, unaweza:
1. Kuripoti kwa Tume ya Kitaifa ya Haki za Binadamu (KNCHR)
2. Kutafuta ushauri wa kisheria kutoka mashirika kama Kituo Cha Sheria
3. Kuwasilisha ombi la kikatiba mahakamani

Je, unahitaji taarifa kuhusu aina maalum za ubaguzi au jinsi ya kuripoti ubaguzi?`;
    }
    
    return `Article 27 of the Constitution guarantees equality and freedom from discrimination. Key points:

• Every person is equal before the law
• Women and men have the right to equal treatment
• The State cannot discriminate based on race, sex, pregnancy, marital status, health status, ethnic origin, color, age, disability, religion, or other grounds
• This includes equal opportunities in political, economic, cultural and social spheres

If you believe you've been discriminated against, you can:
1. Report to the Kenya National Commission on Human Rights (KNCHR)
2. Seek legal advice from organizations like Kituo Cha Sheria
3. File a constitutional petition in court

Would you like information about specific types of discrimination or how to report discrimination?`;
  }

  if (input.includes('article 49') || input.includes('arrested') || input.includes('arrest')) {
    if (language === 'sw') {
      return `Kifungu cha 49 kinalinda haki za watu waliokamatwa. Unapokamatwa, una haki ya:

• Kukaa kimya
• Kufahamishwa haraka kwa nini umekamatwa
• Kutolazimishwa kukiri
• Kuletwa mahakamani ndani ya masaa 24 (au siku ifuatayo ya mahakama)
• Kuachiliwa kwa dhamana isipokuwa kuna sababu za lazima za kutokuachiwa
• Kuwekwa kando na wafungwa waliopatikana na hatia

MUHIMU: Ikiwa umekamatwa:
1. Tumia haki yako ya kukaa kimya
2. Omba kuwasiliana na wakili au mtu wa familia
3. Usisaini chochote usichokielewa
4. Kumbuka maelezo ya afisa aliyekukamata

Kwa msaada wa haraka wa kisheria:
- Simu ya NLAS: 0800-720-440
- Kituo Cha Sheria Mombasa: 041-2316185

Unahitaji taarifa zaidi kuhusu taratibu za kukamatwa?`;
    }
    
    return `Article 49 protects the rights of arrested persons. When arrested, you have the right to:

• Remain silent
• Be informed promptly why you're being arrested
• Not be compelled to confess
• Be brought before a court within 24 hours (or next court day)
• Be released on bail unless there are compelling reasons not to
• Be held separately from convicted prisoners

IMPORTANT: If you're arrested:
1. Exercise your right to remain silent
2. Ask to contact a lawyer or family member
3. Don't sign anything you don't understand
4. Remember the arresting officer's details

For immediate legal help:
- NLAS Hotline: 0800-720-440
- Kituo Cha Sheria Mombasa: 041-2316185

Need more specific information about arrest procedures?`;
  }

  if (input.includes('bill of rights') || input.includes('human rights')) {
    if (language === 'sw') {
      return `Haki za Kimsingi (Sura ya 4 ya Katiba) zina haki zako za msingi na uhuru:

HAKI MUHIMU NI PAMOJA NA:
• Haki ya maisha (Kifungu cha 26)
• Usawa na kutobaguliwa (Kifungu cha 27)
• Heshima ya kibinadamu (Kifungu cha 28)
• Uhuru na usalama (Kifungu cha 29)
• Uhuru wa kujieleza (Kifungu cha 33)
• Haki za kiuchumi na kijamii (Kifungu cha 43)
• Usikilizaji wa haki (Kifungu cha 50)

Haki hizi zinakingwa na sheria na zinaweza kutetewa mahakamani. Ikiwa haki zako zimekiukwa, unaweza:
- Kuwasilisha ombi la kikatiba
- Kutafuta msaada kutoka mashirika ya haki za binadamu
- Kuripoti kwa KNCHR

Kwa ukiukaji maalum wa haki, wasiliana na:
- KNCHR Coast Office: 041-2230496
- Kituo Cha Sheria: 041-2316185

Ni haki gani maalum ungependa kujua zaidi?`;
    }
    
    return `The Bill of Rights (Chapter 4 of the Constitution) contains your fundamental rights and freedoms:

KEY RIGHTS INCLUDE:
• Right to life (Article 26)
• Equality and non-discrimination (Article 27)
• Human dignity (Article 28)
• Freedom and security (Article 29)
• Freedom of expression (Article 33)
• Economic and social rights (Article 43)
• Fair hearing (Article 50)

These rights are protected by law and enforceable in court. If your rights are violated, you can:
- File a constitutional petition
- Seek help from human rights organizations
- Report to KNCHR

For specific rights violations, contact:
- KNCHR Coast Office: 041-2230496
- Kituo Cha Sheria: 041-2316185

Which specific right would you like to learn more about?`;
  }

  // Landlord-tenant issues
  if (input.includes('landlord') || input.includes('tenant') || input.includes('eviction') || input.includes('rent')) {
    if (language === 'sw') {
      return `Masuala ya mmiliki-mpangaji yanashughulikiwa na Sheria ya Kuzuia Kodi na sheria zingine. Hapa kuna haki zako muhimu:

HAKI ZA MPANGAJI:
• Haki ya kupewa notisi ya kutosha kabla ya kufukuzwa (kawaida siku 30)
• Haki ya kutumia mali kwa amani
• Haki ya kupata huduma muhimu
• Haki ya faragha (mmiliki hawezi kuingia bila ruhusa)
• Haki ya kuongezewa kodi kwa kiasi cha busara

MASUALA YA KAWAIDA NA SULUHISHO:
• Kufukuzwa kinyume cha sheria: Wasiliana na polisi, tafuta msaada wa kisheria
• Migogoro ya kodi: Mahakama ya Madai Madogo kwa kiasi chini ya 1M KES
• Hali mbaya ya maisha: Ripoti kwa idara ya afya ya kaunti
• Migogoro ya amana: Weka stakabadhi, tafuta upatanisho

MSAADA WA KISHERIA:
- Kituo Cha Sheria: 041-2316185
- Mahakama ya Madai Madogo: Mahakama za Sheria Mombasa
- NLAS: 0800-720-440

Muunganiko wa kikatiba: Kifungu cha 43 kinahakikisha haki yako ya makazi ya kutosha!

Unahitaji msaada na suala maalum la mmiliki-mpangaji?`;
    }
    
    return `Landlord-tenant issues are governed by the Rent Restriction Act and other laws. Here are your key rights:

TENANT RIGHTS:
• Right to adequate notice before eviction (usually 30 days)
• Right to peaceful enjoyment of the property
• Right to have essential services maintained
• Right to privacy (landlord cannot enter without permission)
• Right to reasonable rent increases

COMMON ISSUES & SOLUTIONS:
• Illegal eviction: Contact police, seek legal help
• Rent disputes: Small Claims Court for amounts under 1M KES
• Poor living conditions: Report to county health department
• Deposit disputes: Keep receipts, seek mediation

LEGAL HELP:
- Kituo Cha Sheria: 041-2316185
- Small Claims Court: Mombasa Law Courts
- NLAS: 0800-720-440

Constitutional connection: Article 43 guarantees your right to adequate housing!

Need help with a specific landlord-tenant issue?`;
  }

  // Small claims court
  if (input.includes('small claims') || input.includes('court') || input.includes('sue')) {
    return `Small Claims Court handles disputes under 1 Million KES quickly and affordably:

WHAT CASES QUALIFY:
• Debt recovery
• Contract disputes
• Property damage claims
• Service provider disputes
• Employment claims (within limits)

HOW TO FILE:
1. Visit the Small Claims Court at Mombasa Law Courts
2. Fill out Form SC1 (Statement of Claim)
3. Pay filing fee (usually 1% of claim amount)
4. Serve defendant with court papers
5. Attend hearing (usually within 60 days)

ADVANTAGES:
• No lawyer required (but allowed)
• Faster resolution (2-6 months)
• Lower costs
• Simplified procedures

YOUR RIGHTS (Article 48): Access to justice is guaranteed by the Constitution!

Location: Mombasa Law Courts, Mombasa-Malindi Road
Phone: 041-2312421

Need help determining if your case qualifies for Small Claims Court?`;
  }

  // Crime reporting
  if (input.includes('crime') || input.includes('police') || input.includes('report')) {
    return `To report a crime in Kenya:

IMMEDIATE STEPS:
1. Call 999 or 112 for emergencies
2. Go to the nearest police station
3. File an Occurrence Book (OB) entry
4. Get an OB number for your records
5. Request a copy of your statement

YOUR RIGHTS (Article 49 & 50):
• Right to be treated with dignity
• Right to have your case investigated
• Right to be informed of progress
• Right to police protection if threatened

IMPORTANT POLICE STATIONS IN MOMBASA:
• Central Police Station: 041-2312222
• Nyali Police Station: 041-4471020
• Likoni Police Station: 041-4510204

IF POLICE DON'T HELP:
- Report to KNCHR: 041-2230496
- Contact Haki Centre: 0700-899-222
- File complaint with IPOA (police oversight)

REMEMBER: Police are required to assist you - it's your constitutional right!

What type of crime do you need to report?`;
  }

  // General legal advice
  if (input.includes('lawyer') || input.includes('legal help') || input.includes('attorney')) {
    return `Here are ways to get legal help in Mombasa:

FREE LEGAL AID:
• Kituo Cha Sheria: 041-2316185 (comprehensive legal aid)
• NLAS Hotline: 0800-720-440 (government legal aid)
• FIDA Kenya: 0722-754-322 (women and children)
• Law Society of Kenya: 041-2222-649 (pro-bono referrals)

WHEN YOU NEED A LAWYER:
• Criminal charges
• Complex civil cases
• Property transactions
• Business disputes
• Constitutional violations

HOW TO FIND A LAWYER:
1. Contact LSK for referrals
2. Check with legal aid organizations first
3. Ask for fee estimates upfront
4. Verify lawyer's practicing certificate

YOUR CONSTITUTIONAL RIGHT: Article 48 guarantees access to justice, and Article 50 guarantees legal representation in criminal cases.

Remember: Always ask about free legal aid options first!

What specific legal issue do you need help with?`;
  }

  // Default response for other queries
  const responses = [
    language === 'sw' ? 
    `Naelewa unauliza kuhusu "${userInput}". Ingawa ninaweza kutoa taarifa za jumla kuhusu sheria ya Kenya, ningependekeza kuwasiliana na rasilimali hizi kwa mwongozo maalum wa kisheria:

• Kituo Cha Sheria Mombasa: 041-2316185
• Simu ya Msaada wa NLAS: 0800-720-440
• KNCHR Coast Office: 041-2230496

Unaweza pia kuvinjari sehemu za Katiba au Haki za Kimsingi kwenye tovuti hii kwa vifungu vinavyohusiana.

Je, unaweza kuwa maalum zaidi kuhusu swali lako la kisheria?` :
    `I understand you're asking about "${userInput}". While I can provide general information about Kenyan law, I'd recommend contacting these resources for specific legal guidance:

• Kituo Cha Sheria Mombasa: 041-2316185
• NLAS Legal Aid Hotline: 0800-720-440
• KNCHR Coast Office: 041-2230496

You can also browse the Constitution or Bill of Rights sections on this website for relevant articles.

Could you be more specific about your legal question?`,

    language === 'sw' ?
    `Asante kwa swali lako. Kwa mwongozo maalum wa kisheria kuhusu "${userInput}", tafadhali:

• Wasiliana na Kituo Cha Sheria Mombasa: 041-2316185
• Piga simu NLAS Legal Aid Hotline: 0800-720-440  
• Vinjari sehemu yetu ya Haki za Kimsingi kwa haki zako za msingi

Je, unaweza kuwa maalum zaidi kuhusu swali lako la kisheria?` :
    `Thank you for your question about "${userInput}". For the most accurate legal guidance, I recommend:

1. Consulting the Constitution (available on this website)
2. Contacting a legal aid organization
3. Speaking with a qualified lawyer

If this relates to your constitutional rights, check our Bill of Rights section. For immediate legal help, call NLAS at 0800-720-440.

Is there a specific aspect of this issue you'd like me to help clarify?`,

    language === 'sw' ?
    `Naona unauliza kuhusu "${userInput}". Hapa ni jinsi ninavyoweza kukusaidia:

• Kutafuta hifadhidata yetu ya Katiba
• Kutoa taarifa kuhusu haki zako
• Kukuunganisha na rasilimali za msaada wa kisheria

Kwa ushauri wa kisheria wa kibinafsi, wasiliana na wakili aliyeidhinishwa au shirika la msaada wa kisheria.

Ni eneo gani maalum la kisheria ungependa kujua zaidi?` :
    `I see you're asking about "${userInput}". While I can provide general legal information, for specific situations you should:

• Contact Kituo Cha Sheria for free legal aid
• Browse our Constitution section for relevant articles
• Call NLAS at 0800-720-440 for immediate help

Remember: This is general information only, not legal advice. Your specific situation may require professional legal consultation.

What specific legal area would you like to learn more about?`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};