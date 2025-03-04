import React, { useEffect } from 'react';
import * as d3 from 'd3';
import "@dspa-nightingale/nightingale-structure/nightingale-structure";

function Pathway() {
    useEffect(() => {
        async function fetchPathwayData() {
            try {
                //const response = await fetch("https://rest.kegg.jp/get/hsa00600/kgml", { mode: 'no-cors' });

                const xmlText = `<?xml version="1.0"?>
<!DOCTYPE pathway SYSTEM "https://www.kegg.jp/kegg/xml/KGML_v0.7.2_.dtd">
<!-- Creation date: Aug 25, 2023 11:46:18 +0900 (GMT+9) -->
<pathway name="path:hsa00600" org="hsa" number="00600"
         title="Sphingolipid metabolism"
         image="https://www.kegg.jp/kegg/pathway/hsa/hsa00600.png"
         link="https://www.kegg.jp/kegg-bin/show_pathway?hsa00600">
    <entry id="35" name="hsa:55331" type="gene" reaction="rn:R06518"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:55331">
        <graphics name="ACER3, APHC, PHCA, PLDECO" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="450" y="405" width="46" height="17"/>
    </entry>
    <entry id="36" name="ko:K05848" type="ortholog" reaction="rn:R06528"
        link="https://www.kegg.jp/dbget-bin/www_bget?K05848">
        <graphics name="K05848" fgcolor="#000000" bgcolor="#FFFFFF"
             type="rectangle" x="450" y="287" width="46" height="17"/>
    </entry>
    <entry id="38" name="hsa:130367 hsa:81537" type="gene" reaction="rn:R06522"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:130367+hsa:81537">
        <graphics name="SGPP2, SPP2, SPPase2..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="756" y="466" width="46" height="17"/>
    </entry>
    <entry id="39" name="hsa:130367 hsa:81537" type="gene" reaction="rn:R06521"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:130367+hsa:81537">
        <graphics name="SGPP2, SPP2, SPPase2..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="597" y="169" width="46" height="17"/>
    </entry>
    <entry id="40" name="hsa:130367 hsa:81537" type="gene" reaction="rn:R06520"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:130367+hsa:81537">
        <graphics name="SGPP2, SPP2, SPPase2..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="307" y="213" width="46" height="17"/>
    </entry>
    <entry id="41" name="hsa:427 hsa:56624" type="gene" reaction="rn:R06518"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:427+hsa:56624">
        <graphics name="ASAH1, AC, ACDase, ASAH, PHP, PHP32, SMAPME..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="450" y="384" width="46" height="17"/>
    </entry>
    <entry id="42" name="hsa:427 hsa:56624" type="gene" reaction="rn:R06528"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:427+hsa:56624">
        <graphics name="ASAH1, AC, ACDase, ASAH, PHP, PHP32, SMAPME..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="450" y="266" width="46" height="17"/>
    </entry>
    <entry id="43" name="hsa:10715 hsa:204219 hsa:253782 hsa:29956 hsa:79603 hsa:91012" type="gene" reaction="rn:R06517"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:10715+hsa:204219+hsa:253782+hsa:29956+hsa:79603+hsa:91012">
        <graphics name="CERS1, EPM8, GDF-1, GDF1, LAG1, LASS1, UOG1..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="450" y="359" width="46" height="17"/>
    </entry>
    <entry id="44" name="hsa:123099 hsa:8560" type="gene" reaction="rn:R06519"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:123099+hsa:8560">
        <graphics name="DEGS2, C14orf66, DES2, FADS8..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="583" y="347" width="46" height="17"/>
    </entry>
    <entry id="45" name="ko:K04709" type="ortholog" reaction="rn:R06527"
        link="https://www.kegg.jp/dbget-bin/www_bget?K04709">
        <graphics name="K04709" fgcolor="#000000" bgcolor="#FFFFFF"
             type="rectangle" x="450" y="229" width="46" height="17"/>
    </entry>
    <entry id="46" name="hsa:123099 hsa:8560" type="gene" reaction="rn:R06526"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:123099+hsa:8560">
        <graphics name="DEGS2, C14orf66, DES2, FADS8..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="510" y="322" width="46" height="17"/>
    </entry>
    <entry id="47" name="hsa:123099 hsa:8560" type="gene" reaction="rn:R06525"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:123099+hsa:8560">
        <graphics name="DEGS2, C14orf66, DES2, FADS8..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="388" y="322" width="46" height="17"/>
    </entry>
    <entry id="48" name="hsa:339221 hsa:55512 hsa:55627 hsa:6609 hsa:6610" type="gene" reaction="rn:R02541"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:339221+hsa:55512+hsa:55627+hsa:6609+hsa:6610">
        <graphics name="ENPP7, ALK-SMase, E-NPP_7, NPP-7, NPP7..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="756" y="358" width="46" height="17"/>
    </entry>
    <entry id="49" name="hsa:10715 hsa:204219 hsa:253782 hsa:29956 hsa:79603 hsa:91012" type="gene" reaction="rn:R01496"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:10715+hsa:204219+hsa:253782+hsa:29956+hsa:79603+hsa:91012">
        <graphics name="CERS1, EPM8, GDF-1, GDF1, LAG1, LASS1, UOG1..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="606" y="263" width="46" height="17"/>
    </entry>
    <entry id="51" name="ko:K26283" type="ortholog" reaction="rn:R01503"
        link="https://www.kegg.jp/dbget-bin/www_bget?K26283">
        <graphics name="K26283" fgcolor="#000000" bgcolor="#FFFFFF"
             type="rectangle" x="756" y="266" width="46" height="17"/>
    </entry>
    <entry id="52" name="ko:K01123" type="ortholog" reaction="rn:R02542"
        link="https://www.kegg.jp/dbget-bin/www_bget?K01123">
        <graphics name="K01123" fgcolor="#000000" bgcolor="#FFFFFF"
             type="rectangle" x="816" y="385" width="46" height="17"/>
    </entry>
    <entry id="53" name="hsa:64781" type="gene" reaction="rn:R01495"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:64781">
        <graphics name="CERK, LK4, dA59H18.2, dA59H18.3, hCERK" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="756" y="417" width="46" height="17"/>
    </entry>
    <entry id="54" name="hsa:8611 hsa:8612 hsa:8613" type="gene" reaction="rn:R06522"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:8611+hsa:8612+hsa:8613">
        <graphics name="PLPP1, LLP1a, LPP1, PAP-2a, PAP2, PPAP2A..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="756" y="445" width="46" height="17"/>
    </entry>
    <entry id="55" name="hsa:8611 hsa:8612 hsa:8613" type="gene" reaction="rn:R06521"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:8611+hsa:8612+hsa:8613">
        <graphics name="PLPP1, LLP1a, LPP1, PAP-2a, PAP2, PPAP2A..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="547" y="169" width="46" height="17"/>
    </entry>
    <entry id="56" name="hsa:8611 hsa:8612 hsa:8613" type="gene" reaction="rn:R06520"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:8611+hsa:8612+hsa:8613">
        <graphics name="PLPP1, LLP1a, LPP1, PAP-2a, PAP2, PPAP2A..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="256" y="213" width="46" height="17"/>
    </entry>
    <entry id="57" name="cpd:C00836" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C00836">
        <graphics name="C00836" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="363" y="348" width="8" height="8"/>
    </entry>
    <entry id="58" name="cpd:C12144" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C12144">
        <graphics name="C12144" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="401" y="276" width="8" height="8"/>
    </entry>
    <entry id="59" name="cpd:C12145" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C12145">
        <graphics name="C12145" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="508" y="276" width="8" height="8"/>
    </entry>
    <entry id="60" name="cpd:C12126" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C12126">
        <graphics name="C12126" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="508" y="348" width="8" height="8"/>
    </entry>
    <entry id="61" name="path:hsa00604" type="map"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa00604">
        <graphics name="Glycosphingolipid biosynthesis - ganglio series" fgcolor="#000000" bgcolor="#FFFFFF"
             type="roundrectangle" x="146" y="764" width="170" height="34"/>
    </entry>
    <entry id="62" name="cpd:C01290" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C01290">
        <graphics name="C01290" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="363" y="454" width="8" height="8"/>
    </entry>
    <entry id="63" name="cpd:C06124" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C06124">
        <graphics name="C06124" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="671" y="128" width="8" height="8"/>
    </entry>
    <entry id="64" name="path:hsa00603" type="map"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa00603">
        <graphics name="Glycosphingolipid biosynthesis - globo and isoglobo series" fgcolor="#000000" bgcolor="#FFFFFF"
             type="roundrectangle" x="352" y="764" width="170" height="34"/>
    </entry>
    <entry id="65" name="path:hsa00601" type="map"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa00601">
        <graphics name="Glycosphingolipid biosynthesis - lacto and neolacto series" fgcolor="#000000" bgcolor="#FFFFFF"
             type="roundrectangle" x="211" y="407" width="170" height="34"/>
    </entry>
    <entry id="66" name="path:hsa00260" type="map"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa00260">
        <graphics name="Glycine, serine and threonine metabolism" fgcolor="#000000" bgcolor="#FFFFFF"
             type="roundrectangle" x="166" y="166" width="126" height="34"/>
    </entry>
    <entry id="67" name="hsa:10558 hsa:55304 hsa:9517" type="gene" reaction="rn:R01281"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:10558+hsa:55304+hsa:9517">
        <graphics name="SPTLC1, ALS27, HSAN1, HSN1, LBC1, LCB1, SPT1, SPTI..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="198" y="349" width="46" height="17"/>
    </entry>
    <entry id="68" name="hsa:2531" type="gene" reaction="rn:R02978"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2531">
        <graphics name="KDSR, DHSR, EKVP4, FVT1, SDR35C1" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="307" y="358" width="46" height="17"/>
    </entry>
    <entry id="69" name="hsa:9514" type="gene" reaction="rn:R05105"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:9514">
        <graphics name="GAL3ST1, CST" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="756" y="654" width="46" height="17"/>
    </entry>
    <entry id="70" name="hsa:2717" type="gene" reaction="rn:R04019"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2717">
        <graphics name="GLA, GALA" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="649" y="594" width="46" height="17"/>
    </entry>
    <entry id="71" name="hsa:9514" type="gene" reaction="rn:R04017"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:9514">
        <graphics name="GAL3ST1, CST" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="756" y="547" width="46" height="17"/>
    </entry>
    <entry id="72" name="hsa:10825 hsa:129807 hsa:4758 hsa:4759" type="gene" reaction="rn:R04018"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:10825+hsa:129807+hsa:4758+hsa:4759">
        <graphics name="NEU3, SIAL3..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="601" y="546" width="46" height="17"/>
    </entry>
    <entry id="73" name="hsa:7368" type="gene" reaction="rn:R01500"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:7368">
        <graphics name="UGT8, CGT, UGT4" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="694" y="496" width="46" height="17"/>
    </entry>
    <entry id="74" name="hsa:2720" type="gene" reaction="rn:R03355"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2720">
        <graphics name="GLB1, EBP, ELNR1, MPS4B" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="450" y="466" width="46" height="17"/>
    </entry>
    <entry id="75" name="hsa:2629 hsa:57704" type="gene" reaction="rn:R01498"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2629+hsa:57704">
        <graphics name="GBA1, GBA, GCB, GLUC..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="583" y="455" width="46" height="17"/>
    </entry>
    <entry id="76" name="hsa:7357" type="gene" reaction="rn:R01497"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:7357">
        <graphics name="UGCG, GCS, GLCT1" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="583" y="417" width="46" height="17"/>
    </entry>
    <entry id="77" name="hsa:125981 hsa:340485 hsa:427 hsa:56624" type="gene" reaction="rn:R01494"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:125981+hsa:340485+hsa:427+hsa:56624">
        <graphics name="ACER1, ALKCDase1, ASAH3..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="672" y="244" width="46" height="17"/>
    </entry>
    <entry id="80" name="hsa:56848 hsa:8877" type="gene" reaction="rn:R01926"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:56848+hsa:8877">
        <graphics name="SPHK2, SK_2, SK-2, SPK_2, SPK-2..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="672" y="169" width="46" height="17"/>
    </entry>
    <entry id="81" name="hsa:56848 hsa:8877" type="gene" reaction="rn:R02976"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:56848+hsa:8877">
        <graphics name="SPHK2, SK_2, SK-2, SPK_2, SPK-2..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="362" y="213" width="46" height="17"/>
    </entry>
    <entry id="82" name="hsa:8879" type="gene" reaction="rn:R06516"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:8879">
        <graphics name="SGPL1, NPHS14, RENI, S1PL, SPL" proteinName="O95470" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="583" y="120" width="46" height="17"/>
    </entry>
    <entry id="83" name="hsa:8879" type="gene" reaction="rn:R02464"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:8879">
        <graphics name="SGPL1, NPHS14, RENI, S1PL, SPL" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="450" y="129" width="46" height="17"/>
    </entry>
    <entry id="85" name="hsa:2581" type="gene" reaction="rn:R03617"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2581">
        <graphics name="GALC" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="648" y="474" width="46" height="17"/>
    </entry>
    <entry id="86" name="path:hsa00600" type="map"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa00600">
        <graphics name="TITLE:Sphingolipid metabolism" fgcolor="#000000" bgcolor="#FFFFFF"
             type="roundrectangle" x="147" y="58" width="214" height="25"/>
    </entry>
    <entry id="87" name="ko:K01130" type="ortholog" reaction="rn:R04856"
        link="https://www.kegg.jp/dbget-bin/www_bget?K01130">
        <graphics name="K01130" fgcolor="#000000" bgcolor="#FFFFFF"
             type="rectangle" x="756" y="572" width="46" height="17"/>
    </entry>
    <entry id="88" name="hsa:410" type="gene" reaction="rn:R04856"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:410">
        <graphics name="ARSA, ASA, MLD" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="756" y="593" width="46" height="17"/>
    </entry>
    <entry id="89" name="hsa:9331 hsa:9334" type="gene" reaction="rn:R03354"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:9331+hsa:9334">
        <graphics name="B4GALT6, B4Gal-T6, beta4Gal-T6..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="450" y="446" width="46" height="17"/>
    </entry>
    <entry id="91" name="cpd:C01190" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C01190">
        <graphics name="C01190" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="508" y="455" width="8" height="8"/>
    </entry>
    <entry id="92" name="cpd:C01120" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C01120">
        <graphics name="C01120" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="363" y="128" width="8" height="8"/>
    </entry>
    <entry id="93" name="cpd:C00346" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C00346">
        <graphics name="C00346" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="508" y="128" width="8" height="8"/>
    </entry>
    <entry id="94" name="cpd:C06062" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C06062">
        <graphics name="C06062" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="815" y="265" width="8" height="8"/>
    </entry>
    <entry id="95" name="cpd:C05681" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C05681">
        <graphics name="C05681" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="815" y="290" width="8" height="8"/>
    </entry>
    <entry id="96" name="cpd:C02934" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C02934">
        <graphics name="C02934" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="256" y="348" width="8" height="8"/>
    </entry>
    <entry id="97" name="cpd:C00065" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C00065">
        <graphics name="C00065" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="164" y="289" width="8" height="8"/>
    </entry>
    <entry id="98" name="cpd:C00154" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C00154">
        <graphics name="C00154" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="146" y="348" width="8" height="8"/>
    </entry>
    <entry id="99" name="cpd:C00319" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C00319">
        <graphics name="C00319" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="671" y="203" width="8" height="8"/>
    </entry>
    <entry id="100" name="cpd:C00195" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C00195">
        <graphics name="C00195" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="671" y="348" width="8" height="8"/>
    </entry>
    <entry id="101" name="cpd:C02686" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C02686">
        <graphics name="C02686" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="671" y="546" width="8" height="8"/>
    </entry>
    <entry id="102" name="cpd:C01747" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C01747">
        <graphics name="C01747" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="815" y="128" width="8" height="8"/>
    </entry>
    <entry id="103" name="cpd:C03640" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C03640">
        <graphics name="C03640" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="935" y="348" width="8" height="8"/>
    </entry>
    <entry id="104" name="cpd:C02960" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C02960">
        <graphics name="C02960" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="815" y="455" width="8" height="8"/>
    </entry>
    <entry id="105" name="cpd:C00550" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C00550">
        <graphics name="C00550" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="815" y="348" width="8" height="8"/>
    </entry>
    <entry id="106" name="cpd:C06125" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C06125">
        <graphics name="C06125" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="815" y="546" width="8" height="8"/>
    </entry>
    <entry id="107" name="cpd:C06128" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C06128">
        <graphics name="C06128" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="527" y="546" width="8" height="8"/>
    </entry>
    <entry id="108" name="cpd:C06126" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C06126">
        <graphics name="C06126" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="671" y="654" width="8" height="8"/>
    </entry>
    <entry id="109" name="cpd:C06127" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C06127">
        <graphics name="C06127" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="814" y="654" width="8" height="8"/>
    </entry>
    <entry id="124" name="hsa:166929 hsa:259230" type="gene" reaction="rn:R08969"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:166929+hsa:259230">
        <graphics name="SGMS2, CDL, SMS2..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="756" y="318" width="46" height="17"/>
    </entry>
    <entry id="131" name="ko:K04709" type="ortholog" reaction="rn:R06517"
        link="https://www.kegg.jp/dbget-bin/www_bget?K04709">
        <graphics name="K04709" fgcolor="#000000" bgcolor="#FFFFFF"
             type="rectangle" x="450" y="338" width="46" height="17"/>
    </entry>
    <entry id="133" name="cpd:C03405" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C03405">
        <graphics name="C03405" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="363" y="543" width="8" height="8"/>
    </entry>
    <entry id="134" name="hsa:9514" type="gene" reaction="rn:R12960"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:9514">
        <graphics name="GAL3ST1, CST" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="385" y="510" width="46" height="17"/>
    </entry>
    <entry id="136" name="hsa:410" type="gene" reaction="rn:R12961"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:410">
        <graphics name="ARSA, ASA, MLD" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="341" y="491" width="46" height="17"/>
    </entry>
    <entry id="138" name="cpd:C22467" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C22467">
        <graphics name="C22467" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="363" y="627" width="8" height="8"/>
    </entry>
    <entry id="140" name="hsa:2583" type="gene" reaction="rn:R12962"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2583">
        <graphics name="B4GALNT1, GALGT, GALNACT, GalNAc-T, SPG26" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="385" y="600" width="46" height="17"/>
    </entry>
    <entry id="141" name="hsa:3073 hsa:3074" type="gene" reaction="rn:R12963"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:3073+hsa:3074">
        <graphics name="HEXA, TSD..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="341" y="580" width="46" height="17"/>
    </entry>
    <entry id="142" name="cpd:C04737" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C04737">
        <graphics name="C04737" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="280" y="543" width="8" height="8"/>
    </entry>
    <entry id="144" name="hsa:2717" type="gene" reaction="rn:R03618"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2717">
        <graphics name="GLA, GALA" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="281" y="510" width="46" height="17"/>
    </entry>
    <entry id="147" name="hsa:2581" type="gene" reaction="rn:R13179"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2581">
        <graphics name="GALC" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="896" y="169" width="46" height="17"/>
    </entry>
    <entry id="148" name="cpd:C03108" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C03108">
        <graphics name="C03108" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="965" y="128" width="8" height="8"/>
    </entry>
    <entry id="150" name="hsa:2629 hsa:57704" type="gene" reaction="rn:R13178"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2629+hsa:57704">
        <graphics name="GBA1, GBA, GCB, GLUC..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="966" y="169" width="46" height="17"/>
    </entry>
    <entry id="156" name="hsa:2720" type="gene" reaction="rn:R04633"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2720">
        <graphics name="GLB1, EBP, ELNR1, MPS4B" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="212" y="670" width="46" height="17"/>
    </entry>
    <entry id="157" name="hsa:3073 hsa:3074" type="gene" reaction="rn:R04586"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:3073+hsa:3074">
        <graphics name="HEXA, TSD..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="212" y="586" width="46" height="17"/>
    </entry>
    <entry id="158" name="cpd:C06135" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C06135">
        <graphics name="C06135" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="142" y="627" width="8" height="8"/>
    </entry>
    <entry id="159" name="cpd:C06136" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C06136">
        <graphics name="C06136" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="142" y="710" width="8" height="8"/>
    </entry>
    <entry id="160" name="cpd:C04911" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C04911">
        <graphics name="C04911" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="211" y="710" width="8" height="8"/>
    </entry>
    <entry id="161" name="cpd:C04884" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C04884">
        <graphics name="C04884" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="211" y="627" width="8" height="8"/>
    </entry>
    <entry id="162" name="cpd:C04730" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C04730">
        <graphics name="C04730" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="211" y="543" width="8" height="8"/>
    </entry>
    <entry id="163" name="hsa:3073 hsa:3074" type="gene" reaction="rn:R03492"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:3073+hsa:3074">
        <graphics name="HEXA, TSD..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="143" y="586" width="46" height="17"/>
    </entry>
    <entry id="164" name="hsa:2720" type="gene" reaction="rn:R05112"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2720">
        <graphics name="GLB1, EBP, ELNR1, MPS4B" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="143" y="670" width="46" height="17"/>
    </entry>
    <entry id="167" name="hsa:10825 hsa:129807 hsa:4758 hsa:4759" type="gene" reaction="rn:R03491"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:10825+hsa:129807+hsa:4758+hsa:4759">
        <graphics name="NEU3, SIAL3..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="212" y="510" width="46" height="17"/>
    </entry>
    <entry id="169" name="hsa:3073 hsa:3074" type="gene" reaction="rn:R04184"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:3073+hsa:3074">
        <graphics name="HEXA, TSD..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="281" y="586" width="46" height="17"/>
    </entry>
    <entry id="170" name="cpd:C03272" type="compound"
        link="https://www.kegg.jp/dbget-bin/www_bget?C03272">
        <graphics name="C03272" fgcolor="#000000" bgcolor="#FFFFFF"
             type="circle" x="280" y="627" width="8" height="8"/>
    </entry>
    <entry id="176" name="hsa:7368" type="gene" reaction="rn:R01928"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:7368">
        <graphics name="UGT8, CGT, UGT4" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="840" y="169" width="46" height="17"/>
    </entry>
    <entry id="128" name="hsa:5660 hsa:768239" type="gene"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:5660+hsa:768239">
        <graphics name="PSAP, GLBA, PARK24, PSAPD, SAP1, SAP2..." fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="583" y="502" width="46" height="17"/>
    </entry>
    <entry id="172" name="hsa:2760" type="gene"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2760">
        <graphics name="GM2A, GM2-AP, GM2AP, SAP-3" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="212" y="603" width="46" height="17"/>
    </entry>
    <entry id="173" name="hsa:2760" type="gene"
        link="https://www.kegg.jp/dbget-bin/www_bget?hsa:2760">
        <graphics name="GM2A, GM2-AP, GM2AP, SAP-3" fgcolor="#000000" bgcolor="#BFFFBF"
             type="rectangle" x="143" y="603" width="46" height="17"/>
    </entry>
    <relation entry1="67" entry2="68" type="ECrel">
        <subtype name="compound" value="96"/>
    </relation>
    <relation entry1="56" entry2="68" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="41" entry2="56" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="43" entry2="56" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="47" entry2="56" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="40" entry2="68" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="40" entry2="41" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="40" entry2="43" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="40" entry2="47" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="68" entry2="81" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="41" entry2="81" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="43" entry2="81" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="47" entry2="81" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="41" entry2="68" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="43" entry2="68" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="47" entry2="68" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="41" entry2="47" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="43" entry2="47" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="43" entry2="44" type="ECrel">
        <subtype name="compound" value="60"/>
    </relation>
    <relation entry1="43" entry2="46" type="ECrel">
        <subtype name="compound" value="60"/>
    </relation>
    <relation entry1="41" entry2="44" type="ECrel">
        <subtype name="compound" value="60"/>
    </relation>
    <relation entry1="41" entry2="46" type="ECrel">
        <subtype name="compound" value="60"/>
    </relation>
    <relation entry1="44" entry2="46" type="ECrel">
        <subtype name="compound" value="60"/>
    </relation>
    <relation entry1="42" entry2="47" type="ECrel">
        <subtype name="compound" value="58"/>
    </relation>
    <relation entry1="42" entry2="46" type="ECrel">
        <subtype name="compound" value="59"/>
    </relation>
    <relation entry1="48" entry2="49" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="49" entry2="53" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="49" entry2="54" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="38" entry2="49" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="49" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="49" entry2="73" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="49" entry2="75" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="49" entry2="76" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="44" entry2="49" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="48" entry2="77" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="53" entry2="77" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="54" entry2="77" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="38" entry2="77" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="77" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="73" entry2="77" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="75" entry2="77" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="76" entry2="77" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="44" entry2="77" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="48" entry2="53" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="48" entry2="54" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="38" entry2="48" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="48" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="48" entry2="73" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="48" entry2="75" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="48" entry2="76" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="44" entry2="48" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="53" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="53" entry2="73" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="53" entry2="75" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="53" entry2="76" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="44" entry2="53" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="54" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="54" entry2="73" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="54" entry2="75" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="54" entry2="76" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="44" entry2="54" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="38" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="38" entry2="73" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="38" entry2="75" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="38" entry2="76" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="38" entry2="44" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="75" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="76" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="44" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="73" entry2="75" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="73" entry2="76" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="44" entry2="73" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="44" entry2="75" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="44" entry2="76" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="49" entry2="80" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="77" entry2="80" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="39" entry2="49" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="39" entry2="77" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="49" entry2="55" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="55" entry2="77" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="55" entry2="82" type="ECrel">
        <subtype name="compound" value="63"/>
    </relation>
    <relation entry1="39" entry2="82" type="ECrel">
        <subtype name="compound" value="63"/>
    </relation>
    <relation entry1="80" entry2="82" type="ECrel">
        <subtype name="compound" value="63"/>
    </relation>
    <relation entry1="56" entry2="83" type="ECrel">
        <subtype name="compound" value="92"/>
    </relation>
    <relation entry1="40" entry2="83" type="ECrel">
        <subtype name="compound" value="92"/>
    </relation>
    <relation entry1="81" entry2="83" type="ECrel">
        <subtype name="compound" value="92"/>
    </relation>
    <relation entry1="71" entry2="73" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="73" entry2="88" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="70" entry2="73" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="72" entry2="73" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="71" entry2="85" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="85" entry2="88" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="70" entry2="85" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="72" entry2="85" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="70" entry2="71" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="71" entry2="72" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="70" entry2="88" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="72" entry2="88" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="70" entry2="72" type="ECrel">
        <subtype name="compound" value="101"/>
    </relation>
    <relation entry1="69" entry2="70" type="ECrel">
        <subtype name="compound" value="108"/>
    </relation>
    <relation entry1="74" entry2="76" type="ECrel">
        <subtype name="compound" value="91"/>
    </relation>
    <relation entry1="76" entry2="89" type="ECrel">
        <subtype name="compound" value="91"/>
    </relation>
    <relation entry1="74" entry2="75" type="ECrel">
        <subtype name="compound" value="91"/>
    </relation>
    <relation entry1="75" entry2="89" type="ECrel">
        <subtype name="compound" value="91"/>
    </relation>
    <relation entry1="68" entry2="35" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="40" entry2="56" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="56" entry2="81" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="56" entry2="35" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="40" entry2="81" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="40" entry2="35" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="81" entry2="35" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="47" entry2="35" type="ECrel">
        <subtype name="compound" value="57"/>
    </relation>
    <relation entry1="46" entry2="35" type="ECrel">
        <subtype name="compound" value="60"/>
    </relation>
    <relation entry1="44" entry2="35" type="ECrel">
        <subtype name="compound" value="60"/>
    </relation>
    <relation entry1="42" entry2="81" type="ECrel">
        <subtype name="compound" value="58"/>
    </relation>
    <relation entry1="89" entry2="65" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="89" entry2="64" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="89" entry2="61" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="74" entry2="65" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="74" entry2="64" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="74" entry2="61" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="64" entry2="65" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="61" entry2="65" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="61" entry2="64" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="67" entry2="66" type="maplink">
        <subtype name="compound" value="97"/>
    </relation>
    <relation entry1="49" entry2="124" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="77" entry2="124" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="124" entry2="53" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="124" entry2="54" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="124" entry2="38" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="124" entry2="85" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="124" entry2="73" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="124" entry2="75" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="124" entry2="76" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="124" entry2="44" type="ECrel">
        <subtype name="compound" value="100"/>
    </relation>
    <relation entry1="89" entry2="134" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="136" entry2="74" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="89" entry2="136" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="134" entry2="74" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="134" entry2="65" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="134" entry2="64" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="134" entry2="61" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="136" entry2="65" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="136" entry2="64" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="136" entry2="61" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="134" entry2="140" type="ECrel">
        <subtype name="compound" value="133"/>
    </relation>
    <relation entry1="136" entry2="140" type="ECrel">
        <subtype name="compound" value="133"/>
    </relation>
    <relation entry1="141" entry2="136" type="ECrel">
        <subtype name="compound" value="133"/>
    </relation>
    <relation entry1="141" entry2="134" type="ECrel">
        <subtype name="compound" value="133"/>
    </relation>
    <relation entry1="144" entry2="74" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="144" entry2="89" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="144" entry2="134" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="144" entry2="136" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="144" entry2="64" type="maplink">
        <subtype name="compound" value="142"/>
    </relation>
    <relation entry1="147" entry2="150" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="147" entry2="77" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="147" entry2="80" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="147" entry2="39" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="147" entry2="55" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="147" entry2="49" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="150" entry2="77" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="150" entry2="80" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="150" entry2="39" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="150" entry2="55" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="150" entry2="49" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="89" entry2="167" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="89" entry2="163" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="74" entry2="167" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="74" entry2="163" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="65" entry2="144" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="65" entry2="167" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="65" entry2="163" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="134" entry2="167" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="134" entry2="163" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="136" entry2="167" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="136" entry2="163" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="144" entry2="167" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="144" entry2="163" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="144" entry2="61" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="144" entry2="64" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="167" entry2="163" type="ECrel">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="167" entry2="61" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="167" entry2="64" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="163" entry2="61" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="163" entry2="64" type="maplink">
        <subtype name="compound" value="62"/>
    </relation>
    <relation entry1="163" entry2="164" type="ECrel">
        <subtype name="compound" value="158"/>
    </relation>
    <relation entry1="164" entry2="61" type="maplink">
        <subtype name="compound" value="159"/>
    </relation>
    <relation entry1="157" entry2="156" type="ECrel">
        <subtype name="compound" value="161"/>
    </relation>
    <relation entry1="156" entry2="61" type="maplink">
        <subtype name="compound" value="160"/>
    </relation>
    <relation entry1="144" entry2="169" type="ECrel">
        <subtype name="compound" value="142"/>
    </relation>
    <relation entry1="169" entry2="64" type="maplink">
        <subtype name="compound" value="170"/>
    </relation>
    <relation entry1="176" entry2="150" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="176" entry2="77" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="176" entry2="49" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="176" entry2="80" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="176" entry2="39" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <relation entry1="176" entry2="55" type="ECrel">
        <subtype name="compound" value="99"/>
    </relation>
    <reaction id="35" name="rn:R06518" type="irreversible">
        <substrate id="60" name="cpd:C12126"/>
        <product id="57" name="cpd:C00836"/>
    </reaction>
    <reaction id="38" name="rn:R06522" type="irreversible">
        <substrate id="104" name="cpd:C02960"/>
        <product id="100" name="cpd:C00195"/>
    </reaction>
    <reaction id="39" name="rn:R06521" type="irreversible">
        <substrate id="63" name="cpd:C06124"/>
        <product id="99" name="cpd:C00319"/>
    </reaction>
    <reaction id="40" name="rn:R06520" type="irreversible">
        <substrate id="92" name="cpd:C01120"/>
        <product id="57" name="cpd:C00836"/>
    </reaction>
    <reaction id="41" name="rn:R06518" type="irreversible">
        <substrate id="60" name="cpd:C12126"/>
        <product id="57" name="cpd:C00836"/>
    </reaction>
    <reaction id="42" name="rn:R06528" type="irreversible">
        <substrate id="59" name="cpd:C12145"/>
        <product id="58" name="cpd:C12144"/>
    </reaction>
    <reaction id="43" name="rn:R06517" type="irreversible">
        <substrate id="57" name="cpd:C00836"/>
        <product id="60" name="cpd:C12126"/>
    </reaction>
    <reaction id="44" name="rn:R06519" type="irreversible">
        <substrate id="60" name="cpd:C12126"/>
        <product id="100" name="cpd:C00195"/>
    </reaction>
    <reaction id="46" name="rn:R06526" type="irreversible">
        <substrate id="60" name="cpd:C12126"/>
        <product id="59" name="cpd:C12145"/>
    </reaction>
    <reaction id="47" name="rn:R06525" type="irreversible">
        <substrate id="57" name="cpd:C00836"/>
        <product id="58" name="cpd:C12144"/>
    </reaction>
    <reaction id="48" name="rn:R02541" type="irreversible">
        <substrate id="105" name="cpd:C00550"/>
        <product id="100" name="cpd:C00195"/>
    </reaction>
    <reaction id="49" name="rn:R01496" type="irreversible">
        <substrate id="99" name="cpd:C00319"/>
        <product id="100" name="cpd:C00195"/>
    </reaction>
    <reaction id="53" name="rn:R01495" type="irreversible">
        <substrate id="100" name="cpd:C00195"/>
        <product id="104" name="cpd:C02960"/>
    </reaction>
    <reaction id="54" name="rn:R06522" type="irreversible">
        <substrate id="104" name="cpd:C02960"/>
        <product id="100" name="cpd:C00195"/>
    </reaction>
    <reaction id="55" name="rn:R06521" type="irreversible">
        <substrate id="63" name="cpd:C06124"/>
        <product id="99" name="cpd:C00319"/>
    </reaction>
    <reaction id="56" name="rn:R06520" type="irreversible">
        <substrate id="92" name="cpd:C01120"/>
        <product id="57" name="cpd:C00836"/>
    </reaction>
    <reaction id="67" name="rn:R01281" type="irreversible">
        <substrate id="98" name="cpd:C00154"/>
        <substrate id="97" name="cpd:C00065"/>
        <product id="96" name="cpd:C02934"/>
    </reaction>
    <reaction id="68" name="rn:R02978" type="irreversible">
        <substrate id="96" name="cpd:C02934"/>
        <product id="57" name="cpd:C00836"/>
    </reaction>
    <reaction id="69" name="rn:R05105" type="irreversible">
        <substrate id="108" name="cpd:C06126"/>
        <product id="109" name="cpd:C06127"/>
    </reaction>
    <reaction id="70" name="rn:R04019" type="irreversible">
        <substrate id="108" name="cpd:C06126"/>
        <product id="101" name="cpd:C02686"/>
    </reaction>
    <reaction id="71" name="rn:R04017" type="irreversible">
        <substrate id="101" name="cpd:C02686"/>
        <product id="106" name="cpd:C06125"/>
    </reaction>
    <reaction id="72" name="rn:R04018" type="irreversible">
        <substrate id="107" name="cpd:C06128"/>
        <product id="101" name="cpd:C02686"/>
    </reaction>
    <reaction id="73" name="rn:R01500" type="irreversible">
        <substrate id="100" name="cpd:C00195"/>
        <product id="101" name="cpd:C02686"/>
    </reaction>
    <reaction id="74" name="rn:R03355" type="irreversible">
        <substrate id="62" name="cpd:C01290"/>
        <product id="91" name="cpd:C01190"/>
    </reaction>
    <reaction id="75" name="rn:R01498" type="irreversible">
        <substrate id="91" name="cpd:C01190"/>
        <product id="100" name="cpd:C00195"/>
    </reaction>
    <reaction id="76" name="rn:R01497" type="irreversible">
        <substrate id="100" name="cpd:C00195"/>
        <product id="91" name="cpd:C01190"/>
    </reaction>
    <reaction id="77" name="rn:R01494" type="irreversible">
        <substrate id="100" name="cpd:C00195"/>
        <product id="99" name="cpd:C00319"/>
    </reaction>
    <reaction id="80" name="rn:R01926" type="irreversible">
        <substrate id="99" name="cpd:C00319"/>
        <product id="63" name="cpd:C06124"/>
    </reaction>
    <reaction id="81" name="rn:R02976" type="irreversible">
        <substrate id="57" name="cpd:C00836"/>
        <product id="92" name="cpd:C01120"/>
    </reaction>
    <reaction id="82" name="rn:R06516" type="irreversible">
        <substrate id="63" name="cpd:C06124"/>
        <product id="93" name="cpd:C00346"/>
    </reaction>
    <reaction id="83" name="rn:R02464" type="irreversible">
        <substrate id="92" name="cpd:C01120"/>
        <product id="93" name="cpd:C00346"/>
    </reaction>
    <reaction id="85" name="rn:R03617" type="irreversible">
        <substrate id="101" name="cpd:C02686"/>
        <product id="100" name="cpd:C00195"/>
    </reaction>
    <reaction id="88" name="rn:R04856" type="irreversible">
        <substrate id="106" name="cpd:C06125"/>
        <product id="101" name="cpd:C02686"/>
    </reaction>
    <reaction id="89" name="rn:R03354" type="irreversible">
        <substrate id="91" name="cpd:C01190"/>
        <product id="62" name="cpd:C01290"/>
    </reaction>
    <reaction id="124" name="rn:R08969" type="reversible">
        <substrate id="100" name="cpd:C00195"/>
        <product id="105" name="cpd:C00550"/>
    </reaction>
    <reaction id="141" name="rn:R12963" type="irreversible">
        <substrate id="138" name="cpd:C22467"/>
        <product id="133" name="cpd:C03405"/>
    </reaction>
    <reaction id="140" name="rn:R12962" type="irreversible">
        <substrate id="133" name="cpd:C03405"/>
        <product id="138" name="cpd:C22467"/>
    </reaction>
    <reaction id="136" name="rn:R12961" type="irreversible">
        <substrate id="133" name="cpd:C03405"/>
        <product id="62" name="cpd:C01290"/>
    </reaction>
    <reaction id="134" name="rn:R12960" type="irreversible">
        <substrate id="62" name="cpd:C01290"/>
        <product id="133" name="cpd:C03405"/>
    </reaction>
    <reaction id="147" name="rn:R13179" type="irreversible">
        <substrate id="102" name="cpd:C01747"/>
        <product id="99" name="cpd:C00319"/>
    </reaction>
    <reaction id="150" name="rn:R13178" type="irreversible">
        <substrate id="148" name="cpd:C03108"/>
        <product id="99" name="cpd:C00319"/>
    </reaction>
    <reaction id="144" name="rn:R03618" type="irreversible">
        <substrate id="142" name="cpd:C04737"/>
        <product id="62" name="cpd:C01290"/>
    </reaction>
    <reaction id="169" name="rn:R04184" type="irreversible">
        <substrate id="170" name="cpd:C03272"/>
        <product id="142" name="cpd:C04737"/>
    </reaction>
    <reaction id="167" name="rn:R03491" type="irreversible">
        <substrate id="162" name="cpd:C04730"/>
        <product id="62" name="cpd:C01290"/>
    </reaction>
    <reaction id="157" name="rn:R04586" type="irreversible">
        <substrate id="161" name="cpd:C04884"/>
        <product id="162" name="cpd:C04730"/>
    </reaction>
    <reaction id="156" name="rn:R04633" type="irreversible">
        <substrate id="160" name="cpd:C04911"/>
        <product id="161" name="cpd:C04884"/>
    </reaction>
    <reaction id="163" name="rn:R03492" type="irreversible">
        <substrate id="158" name="cpd:C06135"/>
        <product id="62" name="cpd:C01290"/>
    </reaction>
    <reaction id="164" name="rn:R05112" type="irreversible">
        <substrate id="159" name="cpd:C06136"/>
        <product id="158" name="cpd:C06135"/>
    </reaction>
    <reaction id="176" name="rn:R01928" type="irreversible">
        <substrate id="99" name="cpd:C00319"/>
        <product id="102" name="cpd:C01747"/>
    </reaction>
</pathway> `
               // if (!response.ok) {
                //    throw new Error(`HTTP error! status: ${response.status}`);
                //}
                
                //const xmlText = await response.text();
                const barcodes = {
                    "O95470": [0, 1, 1, 1, 2, 2, 2, 0, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 2, 0]
                }
                
                // Parse the XML text to an XML DOM
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "application/xml");

                // Extract entries (nodes) and relations (edges)
                const entries = Array.from(xmlDoc.getElementsByTagName("entry")).map(entry => {
                    const graphics = entry.getElementsByTagName("graphics")[0];
                    return {
                        id: entry.getAttribute("id"),
                        type: graphics.getAttribute("type"),
                        x: parseFloat(graphics.getAttribute("x")),
                        y: parseFloat(graphics.getAttribute("y")),
                        width: parseFloat(graphics.getAttribute("width")),
                        height: parseFloat(graphics.getAttribute("height")),
                        label: graphics.getAttribute("name"),
                        link: entry.getAttribute("link"),
                        bgColor: graphics.getAttribute("bgcolor"),
                        proteinName: graphics.getAttribute("proteinName")
                    };
                });

                const relations = Array.from(xmlDoc.getElementsByTagName("relation")).map(relation => ({
                    source: relation.getAttribute("entry1"),
                    target: relation.getAttribute("entry2")
                }));

                // Initialize SVG
                const svg = d3.select("#pathway-svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("viewBox", "0 0 2000 1000")
                    .attr("preserveAspectRatio", "xMidYMid meet");

                const lineGenerator = d3.line().curve(d3.curveBasis);

                // Draw nodes
                entries.forEach(d => {
                    if (d.type === "circle") {
                        svg.append("a")
                            .attr("xlink:href", d.link)
                            .attr("target", "_blank")
                            .append("circle")
                            .attr("cx", d.x)
                            .attr("cy", d.y)
                            .attr("r", d.width / 2)
                            .attr("fill", d.bgColor || "white")
                            .attr("stroke", "black");
                    } else if (d.type === "rectangle") {
                        const rectGroup = svg.append("a")
                            .attr("xlink:href", d.link)
                            .attr("target", "_blank")
                            .append("g");

                        if (d.proteinName && barcodes[d.proteinName]) {
                            const barcode = barcodes[d.proteinName];
                            const segmentWidth = d.width / barcode.length;

                            barcode.forEach((value, index) => {
                                rectGroup.append("rect")
                                    .attr("x", d.x - d.width / 2 + index * segmentWidth)
                                    .attr("y", d.y - d.height / 2)
                                    .attr("width", segmentWidth)
                                    .attr("height", d.height)
                                    .attr("fill", value === 0 ? "white" : value === 1 ? "black" : "red")
                                    .attr("stroke", "none");
                            });
                        } else {
                            rectGroup.append("rect")
                                .attr("x", d.x - d.width / 2)
                                .attr("y", d.y - d.height / 2)
                                .attr("width", d.width)
                                .attr("height", d.height)
                                .attr("fill", d.bgColor || "lightgray")
                                .attr("stroke", "black");
                        }

                        svg.append("text")
                            .attr("x", d.x)
                            .attr("y", d.y - 10)
                            .attr("text-anchor", "middle")
                            .attr("font-size", "8px")
                            .text(d.label);

                        if (d.proteinName) {
                            const structureID = `AF-${d.proteinName}-F1`;
                            svg.append("foreignObject")
                                .attr("x", d.x + d.width / 2 + 10)
                                .attr("y", d.y - d.height / 2)
                                .attr("width", 250)
                                .attr("height", 250)
                                .append("xhtml:div")
                                .style("width", "100%")
                                .style("height", "100%")
                                .html(`
                                    <nightingale-structure
                                        protein-accession="${d.proteinName}"
                                        structure-id="${structureID}"
                                        margin-color="transparent"
                                        background-color="white"
                                        highlight-color="red"
                                        style="height: 200px; width: 200px;">
                                    </nightingale-structure>
                                `);
                        }
                    }
                });

                // Draw edges with curves
                relations.forEach(relation => {
                    const sourceNode = entries.find(e => e.id === relation.source);
                    const targetNode = entries.find(e => e.id === relation.target);

                    if (sourceNode && targetNode) {
                        const midX = (sourceNode.x + targetNode.x) / 2;
                        const midY = (sourceNode.y + targetNode.y) / 2;

                        svg.append("path")
                            .attr("d", lineGenerator([
                                [sourceNode.x, sourceNode.y],
                                [midX, midY],
                                [targetNode.x, targetNode.y]
                            ]))
                            .attr("fill", "none")
                            .attr("stroke", "gray")
                            .attr("stroke-width", 1);
                    }
                });
            } catch (error) {
                console.error("Error fetching or parsing pathway data:", error);
            }
        }

        fetchPathwayData();
    }, []);

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
            <svg id="pathway-svg"></svg>
        </div>
    );
}

export default Pathway;