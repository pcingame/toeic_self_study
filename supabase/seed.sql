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
