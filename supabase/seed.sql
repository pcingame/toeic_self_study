-- Sample practice questions, modeled on the official TOEIC Writing & Speaking
-- test structure/timing (not copied from the real exam). Run after schema.sql.
-- Edit/add rows any time from the Supabase Table editor -- no code changes needed.

-- ===================== WRITING =====================
-- Part 1: write one sentence from a picture, using both given words. (standalone practice time: 90s/question)
insert into public.writing_questions (part, group_label, order_index, prompt_text, context, image_url, time_limit_sec) values
(1, 'Part 1 - Set 1', 1, 'Picture: A woman is sitting at a desk, typing on a laptop while drinking coffee.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: while / also', null, 90),
(1, 'Part 1 - Set 1', 2, 'Picture: Several people are waiting in line outside a store before it opens.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: in front of / already', null, 90),
(1, 'Part 1 - Set 1', 3, 'Picture: A mechanic is repairing a car in a garage while another man watches.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: because / tool', null, 90),
(1, 'Part 1 - Set 1', 4, 'Picture: A family is having a picnic under a large tree in a park.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: under / enjoy', null, 90),
(1, 'Part 1 - Set 1', 5, 'Picture: A delivery worker is carrying a stack of boxes into an office building.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: carry / into', null, 90);

-- Part 2: respond to a written request (email). 10 minutes each.
insert into public.writing_questions (part, group_label, order_index, prompt_text, context, image_url, time_limit_sec) values
(2, 'Part 2', 6, 'From: Hotel Manager
Subject: Your recent stay

Dear Guest, we noticed you checked out early from your recent stay with us and wanted to follow up. Could you let us know what happened and whether there is anything we can do to make it right?', 'Directions: Respond to the email as if you are the hotel guest. In your email, give TWO reasons why you left early and request ONE thing the hotel should do to resolve the issue.', null, 600),
(2, 'Part 2', 7, 'From: Office Manager
Subject: New printer policy

Starting next month, all employees must submit a request form before printing more than 20 pages. Please share your thoughts on this new policy.', 'Directions: Respond to the email. Explain ONE concern you have about the policy and suggest ONE alternative solution.', null, 600);

-- Part 3: opinion essay. 30 minutes.
insert into public.writing_questions (part, group_label, order_index, prompt_text, context, image_url, time_limit_sec) values
(3, 'Part 3', 8, 'Do you agree or disagree with the following statement? "Companies should allow employees to work from home whenever they want." Use specific reasons and examples to support your opinion.', 'Directions: Give your opinion. Use specific reasons and examples to support it. You should write at least 300 words.', null, 1800);

-- ===================== SPEAKING =====================
-- Part 1: Read a text aloud. prep 45s, speak 45s.
insert into public.speaking_questions (part, group_label, order_index, prompt_text, image_url, audio_prompt_url, prep_time_sec, speak_time_sec) values
(1, 'Part 1', 1, 'Welcome to Riverside Mall. Today only, all winter clothing is discounted by thirty percent. Visit the customer service desk on the first floor for a free gift with any purchase over fifty dollars. Thank you for shopping with us, and enjoy your visit.', null, null, 45, 45),
(1, 'Part 1', 2, 'Good morning, and thank you for joining this morning''s training session. Over the next hour, we will cover the new safety procedures for the warehouse floor. Please keep your phones on silent and feel free to ask questions at the end.', null, null, 45, 45);

-- Part 2: Describe a picture. prep 30s, speak 45s.
insert into public.speaking_questions (part, group_label, order_index, prompt_text, image_url, audio_prompt_url, prep_time_sec, speak_time_sec) values
(2, 'Part 2', 3, 'Picture: A busy outdoor cafe with people sitting at tables, a waiter carrying a tray, and bicycles parked nearby. Describe the picture in as much detail as you can.', null, null, 30, 45);

-- Part 3: Respond to questions (based on a survey topic). no prep, speak 15/15/30.
insert into public.speaking_questions (part, group_label, order_index, prompt_text, image_url, audio_prompt_url, prep_time_sec, speak_time_sec) values
(3, 'Part 3 - Survey: Online Shopping', 4, 'Imagine a market research company is conducting a survey about online shopping habits. How often do you shop online?', null, null, 0, 15),
(3, 'Part 3 - Survey: Online Shopping', 5, 'What was the last item you bought online?', null, null, 0, 15),
(3, 'Part 3 - Survey: Online Shopping', 6, 'Do you think online shopping will completely replace physical stores in the future? Why or why not?', null, null, 0, 30);

-- Part 4: Respond to questions using provided information (schedule). prep 45s shared, then speak 15/15/30.
insert into public.speaking_questions (part, group_label, order_index, prompt_text, image_url, audio_prompt_url, prep_time_sec, speak_time_sec) values
(4, 'Part 4 - City Library Workshop Schedule', 7, 'Shared info: "City Library Workshop Schedule - Mon: Resume Writing (2pm, Room A) - Wed: Public Speaking (6pm, Room B, cancelled) - Fri: Digital Photography (4pm, Room A, moved to Room C)". Question: What time does the Resume Writing workshop start, and where is it held?', null, null, 45, 15),
(4, 'Part 4 - City Library Workshop Schedule', 8, 'Using the same schedule: I am interested in the Public Speaking workshop on Wednesday. Can you tell me about it?', null, null, 0, 15),
(4, 'Part 4 - City Library Workshop Schedule', 9, 'Using the same schedule: I would like to attend the Digital Photography workshop on Friday. Can you give me the full details, including any changes?', null, null, 0, 30);

-- Part 5: Propose a solution (voicemail) and express an opinion.
insert into public.speaking_questions (part, group_label, order_index, prompt_text, image_url, audio_prompt_url, prep_time_sec, speak_time_sec) values
(5, 'Part 5 - Propose a Solution', 10, 'Voicemail: "Hi, this is Dana from the accounting department. The shared printer on the third floor has been out of toner for two days and nobody has replaced it. We have reports due tomorrow. Can you help us figure out what to do?" In your response, show that you understand the problem and propose a solution.', null, null, 45, 60),
(5, 'Part 5 - Express an Opinion', 11, 'Some people prefer to work for a large company, while others prefer to work for a small company. Which do you prefer and why?', null, null, 15, 60);

-- ===================== EXTRA PRACTICE =====================
-- Additional Part 1 read-aloud passages (from "TOEIC Speaking - PART 1 Pronunciation & Stress",
-- Toeic Tiến Chung). order_index is kept outside the 1-11 official-exam range so it doesn't
-- renumber the questions above. Safe to run on its own if seed.sql above was already applied.
insert into public.speaking_questions (part, group_label, order_index, prompt_text, image_url, audio_prompt_url, prep_time_sec, speak_time_sec) values
(1, 'Part 1 - Ôn thêm', 100, 'Thank you for calling HealthFirst Pharmacy. To refill a prescription, press 1. To consult with our pharmacist, press 2. To inquire about over-the-counter products such as vitamins, allergy medications, or pain relievers, press 3. For all other inquiries, please stay on the line, and our team will assist you shortly.', null, null, 45, 45),
(1, 'Part 1 - Ôn thêm', 101, 'Good evening! This is the eleven o''clock Chicago News. In tonight''s news broadcast, we will cover the mayoral election campaign, the opening ceremony of the new city hall, and our city high school''s baseball games. But first, let''s go to Rachel Carson for our traffic report.', null, null, 45, 45);

-- Additional Part 1 picture-description prompts (from "TOEIC Writing" slide decks LS 1-3,
-- Toeic Tiến Chung). order_index kept outside the 1-8 official-exam range for the same reason.
insert into public.writing_questions (part, group_label, order_index, prompt_text, context, image_url, time_limit_sec) values
(1, 'Part 1 - Ôn thêm', 100, 'Picture: A small shop stall has various fruits and packaged goods arranged on wooden racks, with bunches of bananas and other produce hanging from the ceiling.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: merchandise / rack', null, 90),
(1, 'Part 1 - Ôn thêm', 101, 'Picture: A striped beach umbrella is set up on a lawn near palm trees, with an empty folding beach chair placed beside it.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: parasol / next to', null, 90),
(1, 'Part 1 - Ôn thêm', 102, 'Picture: A tall floor lamp stands beside an armchair in the corner of a living room, with a framed picture hanging on the wall above.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: lamp / next to', null, 90),
(1, 'Part 1 - Ôn thêm', 103, 'Picture: A black taxi is parked at an airport curb next to a row of luggage carts labeled with an airport name.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: cart / next to', null, 90),
(1, 'Part 1 - Ôn thêm', 104, 'Picture: A child wearing a cap is hanging from a curved bar of outdoor playground climbing equipment.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: child / with', null, 90),
(1, 'Part 1 - Ôn thêm', 105, 'Picture: A loaded truck is driving over an arched stone bridge that crosses a river.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: bridge / over', null, 90),
(1, 'Part 1 - Ôn thêm', 106, 'Picture: A woman and a man are leaning over a desk together, pointing at an open book with a pen.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: woman / and', null, 90),
(1, 'Part 1 - Ôn thêm', 107, 'Picture: Four people are standing on a golf course; one man is swinging a golf club while the other three watch and hold their golf bags.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: golf / but', null, 90),
(1, 'Part 1 - Ôn thêm', 108, 'Picture: Two men in suits are shaking hands across a small table set with coffee cups after finishing their meeting.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: now that / shake', null, 90),
(1, 'Part 1 - Ôn thêm', 109, 'Picture: A person in a warm coat and hat is walking barefoot across a snow-covered path.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: barefoot / although', null, 90),
(1, 'Part 1 - Ôn thêm', 110, 'Picture: A woman holding a large black umbrella is standing outside in heavy rain.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: even though / rain', null, 90),
(1, 'Part 1 - Ôn thêm', 111, 'Picture: A man is sitting at his desk writing on a notepad while holding a phone to his ear.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: while / phone', null, 90),
(1, 'Part 1 - Ôn thêm', 112, 'Picture: A woman sitting in a shoe store is trying on a pair of white shoes, surrounded by shelves of shoe boxes.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: if / fit', null, 90),
(1, 'Part 1 - Ôn thêm', 113, 'Picture: A woman is reaching up to open an overhead kitchen cabinet to take out a cup.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: in order to / open', null, 90),
(1, 'Part 1 - Ôn thêm', 114, 'Picture: Two women are walking through an airport terminal, one pulling a rolling suitcase, under a "Ground Transportation" sign.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: because / luggage', null, 90),
(1, 'Part 1 - Ôn thêm', 115, 'Picture: A round wooden table holding a pitcher and bowls is surrounded by several potted plants on a tiled patio.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: table / and', null, 90),
(1, 'Part 1 - Ôn thêm', 116, 'Picture: Four people are sitting around a round table in a meeting room; one man looks on while the others review documents.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: while / watch', null, 90),
(1, 'Part 1 - Ôn thêm', 117, 'Picture: Three people are riding horses in a line along a snowy trail lined with a wooden fence.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: while / ride', null, 90),
(1, 'Part 1 - Ôn thêm', 118, 'Picture: Two women are sitting together at a table, one pointing at a laptop screen to show the other something.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: how / show', null, 90),
(1, 'Part 1 - Ôn thêm', 119, 'Picture: A man wearing a long coat is standing outside a glass office entrance, looking at the door.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: if / decide', null, 90),
(1, 'Part 1 - Ôn thêm', 120, 'Picture: A man is loading boxes onto a wheeled cart in a stockroom while another person works at a desk nearby.', 'Write ONE sentence based on the picture using the two words/phrases given. You may change the word forms. Required words: because / cart', null, 90),
(1, 'Part 1 - Ôn thêm', 121, 'Picture: A row of passengers is lined up outside a bus, handing tickets to a man standing at the door before boarding.', 'Write ONE sentence based on the picture using the two words/phrases given. Required words: before / bus', null, 90);
