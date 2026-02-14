import { useState, useEffect, useRef } from "react";

const BODY_REGIONS = [
  { id: "shoulder", label: "Shoulder", icon: "🦴", x: 50, y: 18 },
  { id: "humerus", label: "Humerus", icon: "🦴", x: 38, y: 28 },
  { id: "elbow", label: "Elbow", icon: "🦴", x: 35, y: 35 },
  { id: "forearm", label: "Forearm", icon: "🦴", x: 32, y: 42 },
  { id: "wrist", label: "Wrist/Hand", icon: "🦴", x: 28, y: 50 },
  { id: "spine", label: "Spine", icon: "🦴", x: 50, y: 40 },
  { id: "pelvis", label: "Pelvis/Hip", icon: "🦴", x: 50, y: 52 },
  { id: "femur", label: "Femur", icon: "🦴", x: 45, y: 62 },
  { id: "knee", label: "Knee", icon: "🦴", x: 48, y: 72 },
  { id: "tibia", label: "Tibia/Fibula", icon: "🦴", x: 46, y: 80 },
  { id: "ankle", label: "Ankle/Foot", icon: "🦴", x: 48, y: 90 },
];

const FRACTURE_DATABASE = {
  shoulder: {
    title: "Shoulder Fractures",
    fractures: [
      {
        name: "Proximal Humerus Fracture",
        classification: "Neer Classification",
        classDetails: [
          { grade: "1-Part", desc: "Non-displaced or minimally displaced (<1cm, <45°)" },
          { grade: "2-Part", desc: "One segment displaced (GT, LT, surgical neck, or anatomical neck)" },
          { grade: "3-Part", desc: "Two segments displaced" },
          { grade: "4-Part", desc: "Three segments displaced — high risk AVN" },
        ],
        keyFindings: ["AP, scapular Y, axillary lateral views", "Assess tuberosity displacement", "Evaluate for dislocation"],
        management: {
          nonOp: "Sling immobilization + early ROM for non-displaced or 1-part fractures",
          operative: "ORIF (locking plate), hemiarthroplasty (4-part in elderly), reverse TSA (elderly with poor bone)",
          emergency: "Assess for vascular injury (axillary artery), nerve injury (axillary nerve)"
        },
        pearls: ["Check axillary nerve function (regimental badge area)", "CT scan for surgical planning in 3/4-part fractures", "Reverse TSA increasingly favored over hemiarthroplasty in elderly"]
      },
      {
        name: "Clavicle Fracture",
        classification: "Allman / Robinson Classification",
        classDetails: [
          { grade: "Group I (Midshaft)", desc: "Most common (80%). Shortening >2cm = surgical consideration" },
          { grade: "Group II (Distal)", desc: "Type I: minimally displaced. Type II: CC ligament disruption — unstable. Type III: articular" },
          { grade: "Group III (Medial)", desc: "Rare. CT to evaluate. Rule out posterior displacement (airway/vascular risk)" },
        ],
        keyFindings: ["AP + 15° cephalic tilt views", "Measure shortening", "Assess skin tenting"],
        management: {
          nonOp: "Figure-of-8 brace or sling for non-displaced midshaft",
          operative: "Plate fixation for displaced midshaft (>2cm shortening, skin tenting), Type II distal fractures",
          emergency: "Medial fractures: CT angiography if posterior displacement"
        },
        pearls: ["100% union is not guaranteed even with ORIF", "Displaced distal clavicle fractures have high nonunion rate nonoperatively", "Z-shortening correlates with functional outcomes"]
      },
      {
        name: "Scapula Fracture",
        classification: "Anatomic Location",
        classDetails: [
          { grade: "Body/Spine", desc: "Most common. Usually nonoperative. High-energy mechanism" },
          { grade: "Glenoid Neck", desc: "Floating shoulder if combined with clavicle fracture" },
          { grade: "Glenoid Fossa", desc: "Ideberg classification. >25% articular involvement = surgical" },
          { grade: "Acromion/Coracoid", desc: "Rare. Evaluate for associated injuries" },
        ],
        keyFindings: ["AP chest, scapular Y, axillary views", "CT for glenoid involvement", "High association with other thoracic injuries"],
        management: {
          nonOp: "Majority treated nonoperatively. Sling + early ROM",
          operative: "Glenoid articular fractures >25%, floating shoulder, significant medialization >20mm",
          emergency: "Evaluate for pneumothorax, pulmonary contusion, rib fractures (90% have associated injuries)"
        },
        pearls: ["Scapula fractures = high-energy mechanism — full trauma workup", "Floating shoulder = ipsilateral clavicle + scapular neck fractures", "Glenoid rim fractures: assess for instability"]
      }
    ],
  },
  humerus: {
    title: "Humerus Fractures",
    fractures: [
      {
        name: "Humeral Shaft Fracture",
        classification: "AO/OTA Classification",
        classDetails: [
          { grade: "Type A", desc: "Simple — spiral, oblique, or transverse" },
          { grade: "Type B", desc: "Wedge — butterfly fragment" },
          { grade: "Type C", desc: "Complex — comminuted, segmental" },
        ],
        keyFindings: ["Full-length humerus AP/lateral", "Document radial nerve function", "Holstein-Lewis: distal 1/3 spiral → radial nerve palsy"],
        management: {
          nonOp: "Functional bracing (Sarmiento) — mainstay for most isolated shaft fractures",
          operative: "Plate fixation or IMN for: polytrauma, floating elbow, open fractures, vascular injury, obesity",
          emergency: "Primary radial nerve palsy: observe 3-4 months. Secondary palsy (after manipulation): explore"
        },
        pearls: ["Up to 20° sagittal, 30° varus angulation acceptable", "Radial nerve palsy in 12-18% — most recover spontaneously", "Delayed EMG/NCS at 3-4 weeks if no recovery"]
      }
    ]
  },
  elbow: {
    title: "Elbow Fractures",
    fractures: [
      {
        name: "Distal Humerus Fracture",
        classification: "AO/OTA (Type A, B, C)",
        classDetails: [
          { grade: "Type A", desc: "Extra-articular (supracondylar)" },
          { grade: "Type B", desc: "Partial articular (single column)" },
          { grade: "Type C", desc: "Complete articular (bicolumnar) — most common in adults" },
        ],
        keyFindings: ["AP/lateral elbow + traction views", "CT for surgical planning", "Fat pad sign (posterior = pathologic)"],
        management: {
          nonOp: "Rarely indicated. Consider in very low-demand elderly with non-displaced fractures",
          operative: "ORIF with dual plating (parallel or 90-90). TEA for elderly comminuted fractures",
          emergency: "Assess for ulnar nerve injury. Open fractures common"
        },
        pearls: ["Parallel plating provides superior fixation vs 90-90 in biomechanical studies", "Early ROM critical to prevent stiffness", "Ulnar nerve transposition at time of surgery is debated"]
      },
      {
        name: "Olecranon Fracture",
        classification: "Mayo Classification",
        classDetails: [
          { grade: "Type I", desc: "Non-displaced (A: non-comminuted, B: comminuted)" },
          { grade: "Type II", desc: "Displaced-stable (A: non-comminuted, B: comminuted)" },
          { grade: "Type III", desc: "Displaced-unstable (elbow subluxation)" },
        ],
        keyFindings: ["True lateral elbow radiograph", "Assess for coronoid fracture", "Test active extension against gravity"],
        management: {
          nonOp: "Type IA: long arm splint 90° → early ROM if extensor mechanism intact",
          operative: "TBW for simple transverse. Plate fixation for comminuted or oblique. Excision + triceps advance for elderly comminuted",
          emergency: "Type III: reduce elbow urgently, splint, plan for surgery"
        },
        pearls: ["TBW hardware symptomatic in up to 80% — counsel for removal", "Plate fixation increasingly preferred over TBW", "Check for associated coronoid and radial head fractures (terrible triad)"]
      },
      {
        name: "Radial Head Fracture",
        classification: "Mason Classification (Modified)",
        classDetails: [
          { grade: "Type I", desc: "Non-displaced or <2mm displacement" },
          { grade: "Type II", desc: "Displaced >2mm, partial articular, >30% head involvement" },
          { grade: "Type III", desc: "Comminuted, entire head" },
          { grade: "Type IV", desc: "Associated with elbow dislocation" },
        ],
        keyFindings: ["AP/lateral + radiocapitellar view", "Aspiration + injection of local anesthetic for exam", "Assess forearm rotation, wrist (Essex-Lopresti)"],
        management: {
          nonOp: "Type I: sling, early ROM within 1-2 weeks",
          operative: "Type II: ORIF if mechanical block. Type III: radial head arthroplasty. Never excise without replacement if MCL/IOL deficient",
          emergency: "Rule out terrible triad (RH fx + coronoid fx + elbow dislocation)"
        },
        pearls: ["Always assess DRUJ and IOL (Essex-Lopresti lesion)", "Metal radial head replacement preferred over excision if ligamentous instability", "Aspiration of hemarthrosis can improve ROM and comfort for exam"]
      }
    ]
  },
  forearm: {
    title: "Forearm Fractures",
    fractures: [
      {
        name: "Both-Bone Forearm Fracture",
        classification: "AO/OTA",
        classDetails: [
          { grade: "Simple", desc: "Transverse, oblique, or spiral" },
          { grade: "Wedge", desc: "Butterfly fragment present" },
          { grade: "Complex", desc: "Comminuted or segmental" },
        ],
        keyFindings: ["Full forearm AP/lateral including wrist and elbow joints", "Assess for Monteggia (proximal ulna fx + radial head dislocation)", "Assess for Galeazzi (distal radius fx + DRUJ disruption)"],
        management: {
          nonOp: "Adults: almost always operative",
          operative: "Compression plating of both bones via separate incisions. 3.5mm plates",
          emergency: "Open fractures common — I&D, antibiotics, provisional fixation"
        },
        pearls: ["Monteggia: always get elbow films with ulna fracture", "Galeazzi: always get wrist films with radius fracture", "Restore radial bow for full supination/pronation"]
      }
    ]
  },
  wrist: {
    title: "Wrist & Hand Fractures",
    fractures: [
      {
        name: "Distal Radius Fracture",
        classification: "Fernandez / AO Classification",
        classDetails: [
          { grade: "Colles", desc: "Extra-articular, dorsal displacement/angulation (most common)" },
          { grade: "Smith", desc: "Extra-articular, volar displacement (reverse Colles)" },
          { grade: "Barton", desc: "Intra-articular, dorsal or volar rim (shear type)" },
          { grade: "Die-punch", desc: "Depressed lunate fossa fragment" },
        ],
        keyFindings: ["PA + lateral wrist", "Measure: radial inclination (22°), radial height (11mm), volar tilt (11°)", "CT for articular involvement"],
        management: {
          nonOp: "Closed reduction + SAC/sugar-tong for extra-articular, acceptable alignment",
          operative: "Volar locking plate for unstable, intra-articular, or loss of reduction. External fixation as bridge",
          emergency: "Check median nerve (acute CTS). Reduce and splint urgently if significantly displaced"
        },
        pearls: ["Acceptable: <5mm shortening, <5° dorsal tilt, <2mm step-off, <2mm gap", "Always assess DRUJ stability after fixation", "Volar locking plates: avoid prominent screws dorsally (extensor tendon rupture)"]
      },
      {
        name: "Scaphoid Fracture",
        classification: "Herbert Classification",
        classDetails: [
          { grade: "Type A", desc: "Stable acute (A1: tubercle, A2: incomplete waist)" },
          { grade: "Type B", desc: "Unstable acute (B1: distal oblique, B2: complete waist, B3: proximal pole, B4: perilunate)" },
          { grade: "Type C", desc: "Delayed union" },
          { grade: "Type D", desc: "Nonunion (D1: fibrous, D2: sclerotic/AVN)" },
        ],
        keyFindings: ["Scaphoid view (PA in ulnar deviation)", "Snuffbox tenderness, scaphoid compression test", "MRI if radiographs negative and clinical suspicion high"],
        management: {
          nonOp: "Non-displaced waist: thumb spica cast 8-12 weeks. Proximal pole: longer healing time",
          operative: "Headless compression screw for displaced (>1mm), proximal pole, or unstable fractures",
          emergency: "If suspicion high but XR negative: thumb spica + MRI in 1-2 weeks (or immediate MRI)"
        },
        pearls: ["Blood supply retrograde — proximal pole at highest AVN risk", "DISI deformity suggests scapholunate instability", "Nonunion leads to SNAC wrist arthritis"]
      }
    ]
  },
  spine: {
    title: "Spine Fractures",
    fractures: [
      {
        name: "Cervical Spine Fracture",
        classification: "By Level & Mechanism",
        classDetails: [
          { grade: "C1 (Jefferson)", desc: "Burst fracture of atlas. Axial load. Rule of Spence: lateral mass overhang >7mm = TAL disruption" },
          { grade: "C2 (Odontoid)", desc: "Type I: tip (stable). Type II: base (unstable, high nonunion). Type III: body (usually heals)" },
          { grade: "C2 (Hangman's)", desc: "Bilateral pars fracture. Levine-Edwards classification" },
          { grade: "Subaxial (C3-7)", desc: "SLIC score guides management (>4 = surgery, <4 = nonop, 4 = surgeon preference)" },
        ],
        keyFindings: ["CT C-spine (standard in trauma)", "MRI for ligamentous injury, cord signal", "SLIC: morphology + DLC + neurologic status"],
        management: {
          nonOp: "Rigid collar for stable injuries. Halo for C1-2 fractures (selected cases)",
          operative: "Type II odontoid: anterior screw or C1-2 fusion. Subaxial: ACDF or posterior instrumentation based on injury",
          emergency: "Immobilize. High-dose steroids NO LONGER recommended. MRI urgently if neuro deficit"
        },
        pearls: ["NEXUS / Canadian C-spine rules for imaging decisions", "Type II odontoid in elderly: consider primary surgery (high halo complication rate)", "Always clear C-spine before removing collar in obtunded patients"]
      },
      {
        name: "Thoracolumbar Fracture",
        classification: "AO Spine / TLICS",
        classDetails: [
          { grade: "Compression (A1)", desc: "Anterior column failure. Wedging <50% = usually stable" },
          { grade: "Burst (A3/A4)", desc: "Anterior + middle column. Retropulsed fragment. Assess canal compromise" },
          { grade: "Distraction (B)", desc: "Chance fracture (flexion-distraction). High association with abdominal injury" },
          { grade: "Translation (C)", desc: "All three columns failed. Unstable. Surgical" },
        ],
        keyFindings: ["AP/lateral radiographs", "CT for bony detail", "MRI for PLC, disc, cord/conus/cauda equina"],
        management: {
          nonOp: "Stable compression fractures: TLSO brace 8-12 weeks",
          operative: "Burst with neurologic deficit, distraction injuries, translation injuries. Posterior pedicle screw fixation ± anterior column support",
          emergency: "Neurologic deficit: urgent MRI and decompression. Chance fracture: CT abdomen/pelvis"
        },
        pearls: ["TLICS score >4 = surgery, <4 = nonop, 4 = surgeon discretion", "Chance fractures in MVC: always screen for bowel injury", "Osteoporotic compression fractures: consider kyphoplasty if refractory pain >6 weeks"]
      }
    ]
  },
  pelvis: {
    title: "Pelvis & Hip Fractures",
    fractures: [
      {
        name: "Pelvic Ring Fracture",
        classification: "Young-Burgess / Tile",
        classDetails: [
          { grade: "APC (Open Book)", desc: "I: <2.5cm diastasis. II: SI ligament disruption. III: complete disruption" },
          { grade: "LC (Lateral Compression)", desc: "I: sacral buckle. II: crescent (iliac wing). III: contralateral open book (windswept)" },
          { grade: "VS (Vertical Shear)", desc: "Complete hemipelvis displacement. Highly unstable" },
          { grade: "Combined (CM)", desc: "Combined mechanism" },
        ],
        keyFindings: ["AP pelvis, inlet (40° caudal), outlet (40° cephalad)", "CT pelvis with 3D reconstruction", "Assess hemodynamic stability"],
        management: {
          nonOp: "Stable (APC-I, LC-I): weight bearing as tolerated, symptomatic treatment",
          operative: "Unstable: external fixation (acute), anterior plate, posterior SI screws. C-clamp for posterior ring hemorrhage",
          emergency: "Pelvic binder for hemodynamic instability. Angiography for arterial bleed. Preperitoneal packing"
        },
        pearls: ["Pelvic binder at level of greater trochanters", "Mortality 5-20% in unstable fractures", "LC-III (windswept): assess contralateral hemipelvis"]
      },
      {
        name: "Acetabular Fracture",
        classification: "Judet-Letournel (10 types)",
        classDetails: [
          { grade: "Elementary (5)", desc: "Posterior wall, posterior column, anterior wall, anterior column, transverse" },
          { grade: "Associated (5)", desc: "T-type, posterior column + wall, transverse + posterior wall, anterior column + posterior hemitransverse, both column" },
        ],
        keyFindings: ["AP pelvis + Judet views (obturator oblique, iliac oblique)", "CT with 3D reconstruction essential", "Roof arc measurements, dome involvement"],
        management: {
          nonOp: "Congruent joint, roof arc >45° on all views, <2mm step-off, stable hip",
          operative: "Kocher-Langenbeck (posterior), ilioinguinal or modified Stoppa (anterior), combined approaches",
          emergency: "Posterior hip dislocation + posterior wall fracture: urgent reduction within 6 hours (AVN risk)"
        },
        pearls: ["Both-column fracture: secondary congruence may allow nonop treatment", "Sciatic nerve injury in 10-15% of posterior fractures", "Delay surgery until 3-5 days to reduce bleeding (Letournel principle)"]
      },
      {
        name: "Femoral Neck Fracture",
        classification: "Garden Classification",
        classDetails: [
          { grade: "Garden I", desc: "Incomplete/valgus impacted" },
          { grade: "Garden II", desc: "Complete, non-displaced" },
          { grade: "Garden III", desc: "Complete, partially displaced (varus)" },
          { grade: "Garden IV", desc: "Complete, fully displaced" },
        ],
        keyFindings: ["AP pelvis + cross-table lateral hip", "MRI if occult fracture suspected", "Assess patient age, activity level, bone quality"],
        management: {
          nonOp: "Rarely indicated — only non-ambulatory patients with minimal pain",
          operative: "Young patient: urgent reduction + cannulated screws (within 6-12 hrs). Elderly displaced: hemiarthroplasty or THA. Elderly non-displaced: cannulated screws or THA",
          emergency: "Time to surgery matters — ideally <24 hours. Displaced in young: emergent reduction"
        },
        pearls: ["AVN risk proportional to displacement and time to reduction", "Capsulotomy may reduce intracapsular pressure", "THA superior to hemiarthroplasty for active elderly with displaced fractures"]
      },
      {
        name: "Intertrochanteric Fracture",
        classification: "Evans / AO-OTA",
        classDetails: [
          { grade: "Stable", desc: "2-part. Intact posteromedial cortex" },
          { grade: "Unstable", desc: "3-4 part. Loss of posteromedial cortex, reverse obliquity, subtrochanteric extension" },
        ],
        keyFindings: ["AP pelvis + cross-table lateral", "Assess lesser trochanter (posteromedial stability)", "Evaluate lateral wall integrity"],
        management: {
          nonOp: "Essentially never in ambulatory patients",
          operative: "SHS for stable patterns. Cephalomedullary nail (CMN) for unstable, subtrochanteric extension, reverse obliquity",
          emergency: "Optimize medically, surgery within 24-48 hours. Assess anticoagulation status"
        },
        pearls: ["Tip-apex distance <25mm reduces screw cutout risk", "Lateral wall integrity predicts fixation failure with SHS", "CMN increasingly used for all patterns"]
      }
    ]
  },
  femur: {
    title: "Femur Fractures",
    fractures: [
      {
        name: "Femoral Shaft Fracture",
        classification: "AO/OTA by Pattern",
        classDetails: [
          { grade: "Type A", desc: "Simple (spiral, oblique, transverse)" },
          { grade: "Type B", desc: "Wedge (intact butterfly, fragmented butterfly)" },
          { grade: "Type C", desc: "Complex (comminuted, segmental)" },
        ],
        keyFindings: ["Full-length femur AP/lateral", "ALWAYS image hip and knee (ipsilateral neck fracture in 2-6%)", "Assess for open fracture and vascular injury"],
        management: {
          nonOp: "Almost never in adults",
          operative: "Antegrade IMN = gold standard. Retrograde IMN for distal fractures, bilateral, polytrauma, ipsilateral tibia, pregnancy, obesity",
          emergency: "Damage control: external fixation in hemodynamically unstable polytrauma. Femoral traction"
        },
        pearls: ["ALWAYS get dedicated hip images — miss rate for femoral neck fractures is 2-6%", "Start reaming 1.0-1.5mm above nail diameter", "Piriformis vs trochanteric entry: depends on nail design"]
      }
    ]
  },
  knee: {
    title: "Knee Fractures",
    fractures: [
      {
        name: "Distal Femur Fracture",
        classification: "AO/OTA",
        classDetails: [
          { grade: "Type A", desc: "Extra-articular (supracondylar)" },
          { grade: "Type B", desc: "Partial articular (unicondylar — Hoffa fragment)" },
          { grade: "Type C", desc: "Complete articular (intercondylar)" },
        ],
        keyFindings: ["AP/lateral knee + traction views", "CT for articular fracture lines", "Assess vascular status (popliteal artery proximity)"],
        management: {
          nonOp: "Non-ambulatory patients, non-displaced in poor surgical candidates",
          operative: "Lateral locked plate (most common). Retrograde IMN for extra-articular. Medial plate for medial comminution",
          emergency: "Vascular assessment mandatory. Knee spanning external fixation if soft tissue compromised"
        },
        pearls: ["Submuscular (LISS) plating preserves biology", "Anatomic articular reduction, bridge metaphyseal comminution", "Periprosthetic distal femur: retrograde nail if intercondylar space allows"]
      },
      {
        name: "Tibial Plateau Fracture",
        classification: "Schatzker Classification",
        classDetails: [
          { grade: "Type I", desc: "Lateral split (young patient, good bone)" },
          { grade: "Type II", desc: "Lateral split-depression (most common)" },
          { grade: "Type III", desc: "Lateral pure depression (elderly, osteoporotic)" },
          { grade: "Type IV", desc: "Medial plateau (varus stress — check for knee dislocation/ligament injury)" },
          { grade: "Type V", desc: "Bicondylar" },
          { grade: "Type VI", desc: "Plateau + metaphyseal-diaphyseal dissociation" },
        ],
        keyFindings: ["AP/lateral + plateau views (10° caudal tilt)", "CT with 3D reconstruction for surgical planning", "MRI for meniscal and ligamentous injury"],
        management: {
          nonOp: "Non-displaced, <2-3mm depression, stable to varus/valgus stress at 0° and 30°",
          operative: "ORIF: lateral plate ± subchondral rafting screws. Dual plating for bicondylar. Consider staged approach for soft tissue management",
          emergency: "Type IV: high energy, assess for vascular injury (CT angiography). Spanning external fixation for severe soft tissue injury"
        },
        pearls: ["Articular step-off >2mm and condylar widening >5mm = operative", "Staged protocol for high-energy: ex-fix → definitive ORIF when soft tissue ready", "Posterolateral fragment (Schatzker II): may need posterolateral approach", "Compartment syndrome risk — monitor closely"]
      },
      {
        name: "Patellar Fracture",
        classification: "By Pattern",
        classDetails: [
          { grade: "Transverse", desc: "Most common. Assess extensor mechanism integrity" },
          { grade: "Stellate/Comminuted", desc: "Direct blow. Often non-displaced" },
          { grade: "Vertical", desc: "Usually non-displaced. Often missed" },
          { grade: "Pole (inferior/superior)", desc: "Inferior pole avulsion common" },
        ],
        keyFindings: ["AP + lateral knee", "Test active straight leg raise", "Palpable gap in extensor mechanism"],
        management: {
          nonOp: "Non-displaced + intact extensor mechanism: knee immobilizer, WBAT",
          operative: "TBW for transverse. Partial patellectomy for comminuted pole fractures. Total patellectomy: last resort",
          emergency: "Open patellar fractures (close to skin) — evaluate and plan I&D + fixation"
        },
        pearls: ["Anterior tension band converts tension to compression", "Check bipartite patella on contralateral knee (bilateral in 50%)", "Hardware removal rates high (as with olecranon TBW)"]
      }
    ]
  },
  tibia: {
    title: "Tibia/Fibula Fractures",
    fractures: [
      {
        name: "Tibial Shaft Fracture",
        classification: "AO/OTA + Open Fracture: Gustilo-Anderson",
        classDetails: [
          { grade: "Gustilo I", desc: "Wound <1cm, low energy, minimal contamination" },
          { grade: "Gustilo II", desc: "Wound 1-10cm, moderate soft tissue damage" },
          { grade: "Gustilo IIIA", desc: "High energy, adequate soft tissue coverage" },
          { grade: "Gustilo IIIB", desc: "Requires flap coverage (most common tibial open fracture)" },
          { grade: "Gustilo IIIC", desc: "Vascular injury requiring repair" },
        ],
        keyFindings: ["Full-length tibia AP/lateral, include knee and ankle", "Assess compartments for compartment syndrome", "Document neurovascular status and skin condition"],
        management: {
          nonOp: "Closed, aligned, stable: long leg cast then PTB brace (less common in current practice)",
          operative: "IMN = gold standard for diaphyseal fractures. Plate for periarticular extension. External fixation for severe open fractures",
          emergency: "Open fractures: antibiotics within 1 hour, I&D within 24 hours. MONITOR for compartment syndrome"
        },
        pearls: ["5 P's of compartment syndrome: Pain (out of proportion, with passive stretch), Pressure, Paresthesia, Paralysis, Pulselessness", "Compartment pressure >30mmHg or within 30mmHg of diastolic = fasciotomy", "Tibia is most common location for open fractures and compartment syndrome"]
      }
    ]
  },
  ankle: {
    title: "Ankle & Foot Fractures",
    fractures: [
      {
        name: "Ankle Fracture",
        classification: "Weber (Danis-Weber) / Lauge-Hansen",
        classDetails: [
          { grade: "Weber A", desc: "Below syndesmosis. Stable. Usually nonop" },
          { grade: "Weber B", desc: "At level of syndesmosis. Stability depends on deltoid/syndesmosis integrity" },
          { grade: "Weber C", desc: "Above syndesmosis. Unstable. Syndesmotic injury. Usually surgical" },
        ],
        keyFindings: ["AP, mortise (15° IR), lateral ankle", "Tibiofibular clear space (<6mm), overlap (>6mm), medial clear space (<4mm)", "Stress views or MRI if Weber B with suspected deltoid injury"],
        management: {
          nonOp: "Stable Weber A and stable Weber B: CAM boot or short leg cast",
          operative: "Unstable Weber B, Weber C, bimalleolar, trimalleolar. Syndesmotic fixation if unstable. ORIF with plate/screws",
          emergency: "Dislocated ankle: reduce urgently (traction + reversal of deformity). Splint. Assess skin (fracture blisters)"
        },
        pearls: ["Medial clear space >4mm on mortise = deltoid incompetence = unstable", "Maisonneuve fracture: proximal fibula fracture + syndesmotic injury — always examine full fibula", "Posterior malleolus >25-33% of articular surface or >2mm step-off = fix"]
      },
      {
        name: "Talus Fracture",
        classification: "Hawkins Classification (Talar Neck)",
        classDetails: [
          { grade: "Type I", desc: "Non-displaced. AVN risk ~10%" },
          { grade: "Type II", desc: "Displaced with subtalar subluxation/dislocation. AVN ~40%" },
          { grade: "Type III", desc: "Displaced with subtalar + tibiotalar dislocation. AVN ~90%" },
          { grade: "Type IV", desc: "Type III + talonavicular dislocation. AVN ~100%" },
        ],
        keyFindings: ["AP/lateral ankle + Canale view (for talar neck)", "CT essential for surgical planning", "Hawkins sign at 6-8 weeks: subchondral lucency = GOOD prognosis (revascularization)"],
        management: {
          nonOp: "Non-displaced Type I: SLC NWB 8-12 weeks",
          operative: "Types II-IV: urgent reduction + screw fixation (dual approach: anteromedial + anterolateral)",
          emergency: "Types II-IV: URGENT reduction to restore blood supply and reduce skin pressure"
        },
        pearls: ["Hawkins sign = subchondral lucency on AP view at 6-8 weeks = revascularization (good sign)", "AVN may take 6-12 months to manifest", "Talar body fractures have even higher AVN rate than neck fractures"]
      },
      {
        name: "Calcaneus Fracture",
        classification: "Sanders Classification (CT-based)",
        classDetails: [
          { grade: "Type I", desc: "Non-displaced (regardless of fragments)" },
          { grade: "Type II", desc: "2-part (A: lateral, B: central, C: medial)" },
          { grade: "Type III", desc: "3-part (AB, AC, BC)" },
          { grade: "Type IV", desc: "Comminuted (>3 articular fragments)" },
        ],
        keyFindings: ["Lateral foot, Harris axial view", "Bohler's angle (20-40° normal; decreased = depressed)", "CT: coronal cuts classify by posterior facet fragments"],
        management: {
          nonOp: "Sanders I, non-displaced. Also selected patients: diabetes, PVD, smokers, neuropathy",
          operative: "ORIF via extensile lateral approach or sinus tarsi approach. Restore Bohler's angle, articular congruity. Primary subtalar fusion for Sanders IV",
          emergency: "Assess for compartment syndrome of foot. Elevate. CT scan. Rule out spine fracture (10% association)"
        },
        pearls: ["Bohler's angle reduction correlates with worse outcomes", "Extensile lateral approach: wait for wrinkle sign (soft tissue ready)", "Fall from height: always check lumbar spine (10% associated fractures)", "Smoking dramatically increases wound complication rate"]
      },
      {
        name: "Lisfranc Injury",
        classification: "Hardcastle / Myerson",
        classDetails: [
          { grade: "Type A", desc: "Total incongruity (all TMT joints)" },
          { grade: "Type B", desc: "Partial incongruity (B1: medial, B2: lateral)" },
          { grade: "Type C", desc: "Divergent (medial + lateral displacement)" },
        ],
        keyFindings: ["WB AP, lateral, oblique foot", "Fleck sign (avulsion of Lisfranc ligament at 2nd MT base)", "Compare with contralateral foot. 2mm diastasis between 1st and 2nd MT = abnormal"],
        management: {
          nonOp: "Truly non-displaced on WB views (very rare): NWB cast 6-8 weeks with serial imaging",
          operative: "ORIF with screws/bridge plates. Primary arthrodesis for purely ligamentous injuries or severely comminuted",
          emergency: "Reduce dislocations urgently. Assess dorsal skin and compartment pressures"
        },
        pearls: ["Most commonly missed fracture in the foot", "WB films essential — NWB films may appear normal", "Ligamentous Lisfranc: primary fusion may outperform ORIF", "Always compare with contralateral side"]
      }
    ]
  }
};

const QUICK_REFERENCES = [
  {
    title: "Gustilo-Anderson Open Fracture",
    icon: "🔴",
    content: [
      { label: "Type I", value: "Wound <1cm, minimal contamination, low energy" },
      { label: "Type II", value: "Wound 1-10cm, moderate soft tissue, no flap needed" },
      { label: "Type IIIA", value: "High energy, adequate soft tissue for coverage" },
      { label: "Type IIIB", value: "Requires flap (local or free)" },
      { label: "Type IIIC", value: "Vascular injury requiring repair" },
      { label: "Antibiotics", value: "I/II: cefazolin. III: add aminoglycoside. Farm/water: add penicillin" }
    ]
  },
  {
    title: "Compartment Syndrome",
    icon: "🚨",
    content: [
      { label: "Diagnosis", value: "Clinical: pain out of proportion, pain with passive stretch" },
      { label: "Pressure", value: "Absolute >30mmHg or ΔP (diastolic minus compartment) <30mmHg" },
      { label: "Treatment", value: "Emergent fasciotomy — DO NOT DELAY" },
      { label: "Leg", value: "4 compartments: anterior, lateral, superficial posterior, deep posterior" },
      { label: "Forearm", value: "3 compartments: volar, dorsal, mobile wad" },
      { label: "Warning", value: "Pulselessness is a LATE sign — do not wait for it" }
    ]
  },
  {
    title: "DVT Prophylaxis",
    icon: "💊",
    content: [
      { label: "High Risk", value: "Pelvis, acetabulum, hip fractures, polytrauma, TBI" },
      { label: "Mechanical", value: "SCDs, foot pumps when pharmacologic contraindicated" },
      { label: "LMWH", value: "Enoxaparin 30mg BID or 40mg daily — start within 24hr if safe" },
      { label: "Duration", value: "Hip fractures: extend to 35 days post-op" },
      { label: "IVC Filter", value: "Consider if anticoagulation absolutely contraindicated and high risk" },
    ]
  },
  {
    title: "Nerve Injury Patterns",
    icon: "⚡",
    content: [
      { label: "Axillary nerve", value: "Shoulder dislocation, proximal humerus fracture. Deltoid, regimental badge sensation" },
      { label: "Radial nerve", value: "Humeral shaft (Holstein-Lewis). Wrist/finger drop" },
      { label: "Ulnar nerve", value: "Medial epicondyle, distal humerus ORIF. Claw hand, intrinsic weakness" },
      { label: "Median nerve", value: "Distal radius fracture (acute CTS), elbow dislocation. Thenar weakness" },
      { label: "Sciatic nerve", value: "Posterior acetabular fracture, hip dislocation. Foot drop (peroneal division)" },
      { label: "Peroneal nerve", value: "Fibular neck fracture, knee dislocation. Foot drop" },
    ]
  },
  {
    title: "Pediatric Fracture Pearls",
    icon: "👶",
    content: [
      { label: "Salter-Harris I", value: "Through physis only. XR may be normal. Treat clinically" },
      { label: "Salter-Harris II", value: "Most common. Through physis + metaphysis. Good prognosis" },
      { label: "Salter-Harris III", value: "Through physis + epiphysis. Intra-articular. Anatomic reduction needed" },
      { label: "Salter-Harris IV", value: "Through metaphysis + physis + epiphysis. Surgical reduction" },
      { label: "Salter-Harris V", value: "Crush injury. Worst prognosis. Retrospective diagnosis" },
      { label: "Remodeling", value: "Best in: young patients, near physis, in plane of joint motion" },
    ]
  },
  {
    title: "ATLS Primary Survey",
    icon: "🏥",
    content: [
      { label: "A", value: "Airway with C-spine protection" },
      { label: "B", value: "Breathing: auscultate, assess chest wall, SpO₂" },
      { label: "C", value: "Circulation: control hemorrhage, 2 large bore IVs, pelvis binder" },
      { label: "D", value: "Disability: GCS, pupils, gross motor/sensory" },
      { label: "E", value: "Exposure: log-roll, full exam, prevent hypothermia" },
      { label: "Adjuncts", value: "FAST, CXR, pelvic XR, Foley, labs" },
    ]
  }
];

// Checklist data for on-call scenarios
const CHECKLISTS = [
  {
    title: "Open Fracture Protocol",
    icon: "🦴",
    steps: [
      "Photo-document wound before covering",
      "Remove gross contamination, saline-moistened dressing",
      "Align and splint limb",
      "Tetanus prophylaxis if needed",
      "IV antibiotics within 1 hour (cefazolin 2g; add gent for type III)",
      "Mark skin, document NV status",
      "Consent for I&D ± fixation",
      "Notify OR / trauma team",
      "I&D within 24 hours (urgently if contaminated or Type IIIC)"
    ]
  },
  {
    title: "Hip Fracture Admission",
    icon: "🏥",
    steps: [
      "AP pelvis + cross-table lateral hip",
      "Labs: CBC, BMP, coags, type & screen, UA",
      "ECG, CXR",
      "NPO for surgery",
      "DVT prophylaxis (mechanical; chemical when cleared by anesthesia)",
      "Pain management (fascia iliaca block > opioids)",
      "Foley catheter if needed",
      "Optimize medical status (cardiology, medicine co-management)",
      "Surgical plan within 24-48 hours",
      "Notify attending with imaging and plan"
    ]
  },
  {
    title: "Compartment Syndrome",
    icon: "🚨",
    steps: [
      "Recognize: pain out of proportion, pain with passive stretch",
      "Remove all circumferential dressings/casts",
      "Limb at heart level (NOT elevated)",
      "Measure compartment pressures if diagnosis uncertain",
      "ΔP <30 mmHg or absolute >30 mmHg = fasciotomy",
      "Consent for emergent fasciotomy",
      "Notify OR immediately — this is TIME SENSITIVE",
      "4-compartment release (leg) or volar/dorsal release (forearm)",
      "Leave wounds open, vacuum dressing",
      "Plan delayed primary closure or STSG at 48-72 hours"
    ]
  }
];

// Styles
const colors = {
  bg: "#0C0F14",
  card: "#161B24",
  cardHover: "#1C2230",
  accent: "#00D4AA",
  accentDim: "rgba(0, 212, 170, 0.12)",
  accentGlow: "rgba(0, 212, 170, 0.25)",
  danger: "#FF4757",
  dangerDim: "rgba(255, 71, 87, 0.12)",
  warning: "#FFA502",
  warningDim: "rgba(255, 165, 2, 0.12)",
  text: "#E8ECF1",
  textSecondary: "#8892A4",
  textMuted: "#5A6478",
  border: "#232A36",
  borderLight: "#2D3545",
};

const font = `'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, system-ui, sans-serif`;

export default function FractureApp() {
  const [activeTab, setActiveTab] = useState("identify");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedFracture, setSelectedFracture] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [quickRefIndex, setQuickRefIndex] = useState(null);
  const [checklistStates, setChecklistStates] = useState({});
  const [animateIn, setAnimateIn] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    setAnimateIn(true);
    const t = setTimeout(() => setAnimateIn(false), 500);
    return () => clearTimeout(t);
  }, [activeTab, selectedRegion, selectedFracture]);

  // Search across all fractures
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results = [];
    Object.entries(FRACTURE_DATABASE).forEach(([regionId, region]) => {
      region.fractures.forEach((fx) => {
        const searchable = `${fx.name} ${fx.classification} ${fx.classDetails.map(c => c.grade + " " + c.desc).join(" ")} ${fx.keyFindings.join(" ")} ${fx.pearls.join(" ")}`.toLowerCase();
        if (searchable.includes(q)) {
          results.push({ regionId, regionTitle: region.title, fracture: fx });
        }
      });
    });
    // Search quick references too
    QUICK_REFERENCES.forEach((ref, idx) => {
      const searchable = `${ref.title} ${ref.content.map(c => c.label + " " + c.value).join(" ")}`.toLowerCase();
      if (searchable.includes(q)) {
        results.push({ type: "quickRef", index: idx, title: ref.title, icon: ref.icon });
      }
    });
    setSearchResults(results);
  }, [searchQuery]);

  const toggleChecklist = (checklistIdx, stepIdx) => {
    const key = `${checklistIdx}-${stepIdx}`;
    setChecklistStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBack = () => {
    if (selectedFracture) setSelectedFracture(null);
    else if (selectedRegion) setSelectedRegion(null);
    else if (showSearch) { setShowSearch(false); setSearchQuery(""); }
    else if (quickRefIndex !== null) setQuickRefIndex(null);
  };

  const showBackButton = selectedFracture || selectedRegion || showSearch || quickRefIndex !== null;

  // ──────── RENDER FUNCTIONS ────────

  const renderHeader = () => (
    <div style={{
      padding: "12px 20px 8px",
      background: `linear-gradient(180deg, ${colors.bg} 0%, transparent 100%)`,
      position: "sticky", top: 0, zIndex: 100,
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {showBackButton ? (
          <button onClick={handleBack} style={{
            background: "none", border: "none", color: colors.accent,
            fontSize: 15, fontFamily: font, cursor: "pointer", padding: "4px 0",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 18 }}>‹</span> Back
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${colors.accent}, #00A88A)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, boxShadow: `0 2px 12px ${colors.accentGlow}`,
            }}>🦴</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: colors.text, fontFamily: font, letterSpacing: "-0.3px" }}>
                FractureID
              </div>
              <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: font, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Ortho Resident Quick Reference
              </div>
            </div>
          </div>
        )}
        {!showSearch && !showBackButton && (
          <button onClick={() => setShowSearch(true)} style={{
            background: colors.card, border: `1px solid ${colors.border}`,
            borderRadius: 10, width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: colors.textSecondary, fontSize: 16,
          }}>🔍</button>
        )}
      </div>
    </div>
  );

  const renderSearch = () => (
    <div style={{ padding: "0 20px" }}>
      <div style={{
        background: colors.card, borderRadius: 14, padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 10,
        border: `1px solid ${colors.border}`, marginBottom: 16,
      }}>
        <span style={{ color: colors.textMuted, fontSize: 16 }}>🔍</span>
        <input
          autoFocus
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search fractures, classifications, pearls..."
          style={{
            background: "none", border: "none", outline: "none",
            color: colors.text, fontSize: 15, fontFamily: font,
            width: "100%", padding: 0,
          }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} style={{
            background: colors.textMuted, border: "none", borderRadius: "50%",
            width: 20, height: 20, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", color: colors.bg,
            fontSize: 11, fontWeight: 700,
          }}>✕</button>
        )}
      </div>
      {searchResults.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {searchResults.map((r, i) => (
            r.type === "quickRef" ? (
              <button key={i} onClick={() => { setQuickRefIndex(r.index); setShowSearch(false); setSearchQuery(""); setActiveTab("reference"); }} style={{
                background: colors.card, border: `1px solid ${colors.border}`,
                borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                textAlign: "left", display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 22 }}>{r.icon}</span>
                <div>
                  <div style={{ color: colors.text, fontSize: 14, fontWeight: 600, fontFamily: font }}>{r.title}</div>
                  <div style={{ color: colors.textMuted, fontSize: 11, fontFamily: font }}>Quick Reference</div>
                </div>
              </button>
            ) : (
              <button key={i} onClick={() => {
                setSelectedRegion(r.regionId);
                setSelectedFracture(r.fracture);
                setShowSearch(false); setSearchQuery(""); setActiveTab("identify");
              }} style={{
                background: colors.card, border: `1px solid ${colors.border}`,
                borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ color: colors.text, fontSize: 14, fontWeight: 600, fontFamily: font }}>{r.fracture.name}</div>
                <div style={{ color: colors.accent, fontSize: 11, fontFamily: font, marginTop: 2 }}>{r.regionTitle} • {r.fracture.classification}</div>
              </button>
            )
          ))}
        </div>
      ) : searchQuery ? (
        <div style={{ textAlign: "center", padding: 40, color: colors.textMuted, fontSize: 14, fontFamily: font }}>
          No results for "{searchQuery}"
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 40, color: colors.textMuted, fontSize: 14, fontFamily: font }}>
          Search by fracture name, classification, anatomic landmark, or clinical pearl
        </div>
      )}
    </div>
  );

  const renderBodyMap = () => (
    <div style={{ padding: "0 20px" }}>
      <div style={{
        fontSize: 13, color: colors.textSecondary, fontFamily: font,
        marginBottom: 16, textAlign: "center",
      }}>
        Select anatomic region
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 10, maxWidth: 400, margin: "0 auto",
      }}>
        {BODY_REGIONS.map((region, i) => (
          <button key={region.id} onClick={() => setSelectedRegion(region.id)} style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 14, padding: "16px 14px",
            cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", gap: 12,
            transition: "all 0.2s ease",
            animation: `fadeSlideUp 0.3s ease ${i * 0.04}s both`,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = colors.cardHover; e.currentTarget.style.borderColor = colors.accent; }}
            onMouseLeave={e => { e.currentTarget.style.background = colors.card; e.currentTarget.style.borderColor = colors.border; }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: colors.accentDim,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>
              {region.icon}
            </div>
            <div>
              <div style={{ color: colors.text, fontSize: 14, fontWeight: 600, fontFamily: font }}>{region.label}</div>
              <div style={{ color: colors.textMuted, fontSize: 11, fontFamily: font }}>
                {FRACTURE_DATABASE[region.id]?.fractures.length || 0} fractures
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderFractureList = () => {
    const region = FRACTURE_DATABASE[selectedRegion];
    if (!region) return null;
    return (
      <div style={{ padding: "0 20px" }}>
        <div style={{
          fontSize: 20, fontWeight: 700, color: colors.text,
          fontFamily: font, marginBottom: 4, letterSpacing: "-0.3px",
        }}>{region.title}</div>
        <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: font, marginBottom: 20 }}>
          {region.fractures.length} classification{region.fractures.length !== 1 ? "s" : ""}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {region.fractures.map((fx, i) => (
            <button key={i} onClick={() => setSelectedFracture(fx)} style={{
              background: colors.card, border: `1px solid ${colors.border}`,
              borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "left",
              transition: "all 0.2s ease",
              animation: `fadeSlideUp 0.3s ease ${i * 0.06}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = colors.cardHover; e.currentTarget.style.borderColor = colors.accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = colors.card; e.currentTarget.style.borderColor = colors.border; }}
            >
              <div style={{ color: colors.text, fontSize: 15, fontWeight: 600, fontFamily: font }}>{fx.name}</div>
              <div style={{ color: colors.accent, fontSize: 12, fontFamily: font, marginTop: 4 }}>{fx.classification}</div>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10,
              }}>
                {fx.classDetails.slice(0, 3).map((c, j) => (
                  <span key={j} style={{
                    background: colors.accentDim, color: colors.accent,
                    fontSize: 10, padding: "3px 8px", borderRadius: 6,
                    fontFamily: font, fontWeight: 500,
                  }}>{c.grade}</span>
                ))}
                {fx.classDetails.length > 3 && (
                  <span style={{
                    background: colors.accentDim, color: colors.textMuted,
                    fontSize: 10, padding: "3px 8px", borderRadius: 6, fontFamily: font,
                  }}>+{fx.classDetails.length - 3}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFractureDetail = () => {
    if (!selectedFracture) return null;
    const fx = selectedFracture;
    return (
      <div style={{ padding: "0 20px", animation: "fadeSlideUp 0.3s ease both" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: colors.text, fontFamily: font, letterSpacing: "-0.3px", lineHeight: 1.2 }}>
            {fx.name}
          </div>
          <div style={{
            display: "inline-block", marginTop: 8,
            background: colors.accentDim, color: colors.accent,
            fontSize: 12, padding: "4px 10px", borderRadius: 8,
            fontFamily: font, fontWeight: 600,
          }}>{fx.classification}</div>
        </div>

        {/* Classification Details */}
        <Section title="Classification">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {fx.classDetails.map((c, i) => (
              <div key={i} style={{
                background: colors.card, borderRadius: 10, padding: "12px 14px",
                borderLeft: `3px solid ${colors.accent}`,
              }}>
                <div style={{ color: colors.accent, fontSize: 12, fontWeight: 700, fontFamily: font, marginBottom: 3 }}>
                  {c.grade}
                </div>
                <div style={{ color: colors.textSecondary, fontSize: 13, fontFamily: font, lineHeight: 1.5 }}>
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Key Imaging Findings */}
        <Section title="Key Imaging / Findings">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {fx.keyFindings.map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                fontSize: 13, fontFamily: font, color: colors.textSecondary, lineHeight: 1.5,
              }}>
                <span style={{ color: colors.accent, fontSize: 8, marginTop: 6 }}>●</span>
                {f}
              </div>
            ))}
          </div>
        </Section>

        {/* Management */}
        <Section title="Management">
          <ManagementCard label="Non-Operative" color={colors.accent} bg={colors.accentDim} text={fx.management.nonOp} />
          <ManagementCard label="Operative" color={colors.warning} bg={colors.warningDim} text={fx.management.operative} />
          <ManagementCard label="Emergency / Acute" color={colors.danger} bg={colors.dangerDim} text={fx.management.emergency} />
        </Section>

        {/* Clinical Pearls */}
        <Section title="Clinical Pearls">
          <div style={{
            background: `linear-gradient(135deg, rgba(255, 165, 2, 0.08), rgba(255, 165, 2, 0.03))`,
            border: `1px solid rgba(255, 165, 2, 0.15)`,
            borderRadius: 12, padding: 14,
          }}>
            {fx.pearls.map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                fontSize: 13, fontFamily: font, color: colors.text, lineHeight: 1.6,
                marginBottom: i < fx.pearls.length - 1 ? 10 : 0,
              }}>
                <span style={{ color: colors.warning, fontSize: 14, flexShrink: 0 }}>💡</span>
                {p}
              </div>
            ))}
          </div>
        </Section>

        <div style={{ height: 40 }} />
      </div>
    );
  };

  const renderQuickReference = () => (
    <div style={{ padding: "0 20px" }}>
      {quickRefIndex !== null ? (
        <div style={{ animation: "fadeSlideUp 0.3s ease both" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          }}>
            <span style={{ fontSize: 28 }}>{QUICK_REFERENCES[quickRefIndex].icon}</span>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, fontFamily: font }}>
              {QUICK_REFERENCES[quickRefIndex].title}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {QUICK_REFERENCES[quickRefIndex].content.map((item, i) => (
              <div key={i} style={{
                background: colors.card, borderRadius: 12, padding: "14px 16px",
                borderLeft: `3px solid ${colors.accent}`,
              }}>
                <div style={{ color: colors.accent, fontSize: 12, fontWeight: 700, fontFamily: font, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {item.label}
                </div>
                <div style={{ color: colors.textSecondary, fontSize: 13, fontFamily: font, lineHeight: 1.6 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: colors.textSecondary, fontFamily: font, marginBottom: 16 }}>
            Tap a topic for quick review
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUICK_REFERENCES.map((ref, i) => (
              <button key={i} onClick={() => setQuickRefIndex(i)} style={{
                background: colors.card, border: `1px solid ${colors.border}`,
                borderRadius: 14, padding: "16px", cursor: "pointer",
                textAlign: "left", display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.2s ease",
                animation: `fadeSlideUp 0.3s ease ${i * 0.05}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; }}
              >
                <span style={{ fontSize: 26 }}>{ref.icon}</span>
                <div>
                  <div style={{ color: colors.text, fontSize: 14, fontWeight: 600, fontFamily: font }}>{ref.title}</div>
                  <div style={{ color: colors.textMuted, fontSize: 11, fontFamily: font, marginTop: 2 }}>
                    {ref.content.length} items
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderChecklists = () => (
    <div style={{ padding: "0 20px" }}>
      <div style={{ fontSize: 13, color: colors.textSecondary, fontFamily: font, marginBottom: 16 }}>
        On-call protocols and checklists
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {CHECKLISTS.map((cl, ci) => (
          <div key={ci} style={{
            background: colors.card, borderRadius: 14,
            border: `1px solid ${colors.border}`, overflow: "hidden",
            animation: `fadeSlideUp 0.3s ease ${ci * 0.08}s both`,
          }}>
            <div style={{
              padding: "14px 16px", borderBottom: `1px solid ${colors.border}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>{cl.icon}</span>
              <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, fontFamily: font }}>{cl.title}</div>
              <div style={{
                marginLeft: "auto", fontSize: 11, color: colors.accent, fontFamily: font,
              }}>
                {cl.steps.filter((_, si) => checklistStates[`${ci}-${si}`]).length}/{cl.steps.length}
              </div>
            </div>
            <div style={{ padding: "8px 0" }}>
              {cl.steps.map((step, si) => {
                const checked = checklistStates[`${ci}-${si}`];
                return (
                  <button key={si} onClick={() => toggleChecklist(ci, si)} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "10px 16px", width: "100%",
                    background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                      border: checked ? `2px solid ${colors.accent}` : `2px solid ${colors.textMuted}`,
                      background: checked ? colors.accent : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}>
                      {checked && <span style={{ color: colors.bg, fontSize: 13, fontWeight: 700 }}>✓</span>}
                    </div>
                    <div style={{
                      fontSize: 13, fontFamily: font, lineHeight: 1.5,
                      color: checked ? colors.textMuted : colors.textSecondary,
                      textDecoration: checked ? "line-through" : "none",
                      transition: "all 0.2s ease",
                    }}>{step}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabBar = () => (
    <div style={{
      position: "sticky", bottom: 0,
      background: `linear-gradient(180deg, transparent 0%, ${colors.bg} 20%)`,
      padding: "12px 16px 20px",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-around",
        background: colors.card, borderRadius: 16,
        border: `1px solid ${colors.border}`, padding: "6px 4px",
      }}>
        {[
          { id: "identify", icon: "🦴", label: "Identify" },
          { id: "reference", icon: "📋", label: "Reference" },
          { id: "checklists", icon: "✅", label: "Protocols" },
        ].map(tab => (
          <button key={tab.id} onClick={() => {
            setActiveTab(tab.id);
            setSelectedRegion(null);
            setSelectedFracture(null);
            setQuickRefIndex(null);
            setShowSearch(false);
            setSearchQuery("");
          }} style={{
            background: activeTab === tab.id ? colors.accentDim : "transparent",
            border: "none", borderRadius: 12, padding: "8px 20px",
            cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3, transition: "all 0.2s ease",
            flex: 1,
          }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, fontFamily: font,
              color: activeTab === tab.id ? colors.accent : colors.textMuted,
              letterSpacing: "0.3px",
            }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Main content router
  const renderContent = () => {
    if (showSearch) return renderSearch();
    if (activeTab === "identify") {
      if (selectedFracture) return renderFractureDetail();
      if (selectedRegion) return renderFractureList();
      return renderBodyMap();
    }
    if (activeTab === "reference") return renderQuickReference();
    if (activeTab === "checklists") return renderChecklists();
  };

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", height: "100vh",
      background: colors.bg, fontFamily: font,
      display: "flex", flexDirection: "column",
      overflow: "hidden", position: "relative",
    }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0; display: none; }
        input::placeholder { color: ${colors.textMuted}; }
      `}</style>
      {renderHeader()}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", paddingBottom: 8, paddingTop: 8 }}>
        {renderContent()}
      </div>
      {renderTabBar()}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: colors.textMuted,
        fontFamily: font, letterSpacing: "1.5px", textTransform: "uppercase",
        marginBottom: 10,
      }}>{title}</div>
      {children}
    </div>
  );
}

function ManagementCard({ label, color, bg, text }) {
  return (
    <div style={{
      background: bg, borderRadius: 10, padding: "12px 14px",
      marginBottom: 8, borderLeft: `3px solid ${color}`,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color, fontFamily: font,
        textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontSize: 13, color: colors.text, fontFamily: font, lineHeight: 1.6,
      }}>{text}</div>
    </div>
  );
}
