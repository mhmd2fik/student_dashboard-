# Study Sphere

Build the Student-Facing Education Platform

Build a production-quality, modern, professional, fully responsive student platform for a mathematics teacher.

This is the student-facing side of the same education system managed through the admin dashboard.

The student platform must connect logically to the existing admin system and follow all business rules described below.

The entire interface must be:

English only

LTR

Fully responsive

Desktop + tablet + mobile

Modern professional SaaS/EdTech style

Clean and easy for secondary/preparatory students to use

Fast and uncluttered

Do not build a generic LMS template. Build the interface around the exact education and purchasing workflow below.

1. STUDENT ACCOUNT ACCESS

A student cannot use the platform immediately after registration.

Registration flow:

Student creates an account.

Student provides required information.

Account status becomes Pending Approval.

Admin reviews the account.

Admin approves the student.

Student can then log in.

If the account is not approved:

Show a clear message:

"Your account is waiting for admin approval. You will be able to log in once your account has been approved."

Do not allow unapproved students to access the platform.

2. STUDENT LOGIN

Student login uses:

Phone/Student ID as appropriate

Password

After successful login, enforce the one-device rule.

Each student account can be connected to one device only.

On the first successful login:

Register the device.

If the student attempts to log in from another device:

Block the login and show:

"This account is already registered on another device. Please contact the admin to change your authorized device."

Do not automatically replace the old device.

Only the admin can change/reset the authorized device.

3. STUDENT NAVIGATION

The student platform should have a simple primary navigation.

Recommended navigation:

Home

Classes

Books

Wallet

My Learning

Also provide:

Notifications

Profile/account menu

Do not overload the navigation.

On mobile, use a compact mobile navigation/bottom navigation where appropriate.

4. HOME PAGE

The Home page is the student's personalized dashboard.

Show:

Welcome section

Example:

Welcome back, Ahmed 👋

Show:

Student name

Level

Profile image

Wallet card

Display:

Wallet Balance: 400 EGP

Provide:

Recharge Wallet

button.

Continue Learning

Show sessions where the student has active progress.

Each card displays:

Session image

Session name

Category

Progress percentage

Progress bar

Continue button

Example:

Mechanics — Session 03

Progress:

68%

Button:

Continue Learning

Recent notifications

Show latest notifications.

Notifications may contain:

Text

Image

Recommended/available sessions

Show recently published sessions belonging to the student's level.

Do not show sessions from unrelated levels unless they are intentionally made visible by the system.

5. STUDENT PROFILE

Profile page shows:

Profile photo

Full name

Student ID

Level

Gender

Governorate

Phone

Parent phone

Student should not be allowed to edit sensitive/admin-controlled fields unless explicitly supported.

The admin remains the authority for student data.

Display the Student ID clearly.

Also provide the student's QR code.

6. STUDENT QR CODE

Generate/display a QR code containing only the student's Student ID.

The student can:

View QR

Enlarge QR

Download/save QR

The QR is intended for physical class/event attendance.

The QR must not expose:

Phone

Parent phone

Password

Name

Other personal information

7. CLASSES PAGE

The Classes page is the main educational content marketplace.

The structure is:

Student Level → Categories → Sessions

The student's level determines what they see.

Available levels:

3rd Preparatory

1st Secondary

1st Secondary – Baccalaureate

2nd Secondary

2nd Secondary – Baccalaureate

3rd Secondary

A student should primarily see content belonging to their assigned level.

8. CATEGORY VIEW

For the student's level, show its available categories.

Example:

3rd Secondary

Mechanics

Algebra

Calculus

Categories belonging to other levels must not be shown.

Each category may contain:

Category image

Category name

Number of sessions

Clicking a category opens its sessions.

9. SESSION CATALOG

Display sessions inside a category.

Each session card includes:

Cover image

Session name

Price

Category

Description

Included content types

Estimated learning time

Expiration period

Purchase status

If the student has already purchased the session:

Show:

Purchased

and:

Continue

instead of another purchase button.

10. SESSION DETAILS PAGE

Before purchase, the student can see:

Session name

Cover image

Price

Category

Description

Included parts

Estimated learning time

Access/expiration period

Prerequisite session information if applicable

The actual protected content must remain locked until purchase.

11. SESSION PURCHASE

Students purchase sessions individually.

The purchase button should show the exact price.

Example:

Price: 100 EGP

When the student clicks Buy:

Show a confirmation modal:

Purchase Session?

Display:

Session name

Price

Current wallet balance

Balance after purchase

Example:

Current balance:
500 EGP

Session:
100 EGP

Remaining:
400 EGP

Buttons:

Confirm Purchase
Cancel

12. INSUFFICIENT BALANCE

If the wallet balance is insufficient:

Do not allow the purchase.

Show:

Insufficient wallet balance

Display:

Session price

Current wallet balance

Required additional amount

Provide:

Recharge Wallet

button.

13. SESSION PREREQUISITES

Sessions may be independent or dependent on another session.

Example:

Session 3 requires Session 2.

If Session 2 has not been purchased:

Show:

Locked

Explain:

Purchase Session 2 to unlock this session.

Once Session 2 is purchased:

Session 3 becomes available.

IMPORTANT:

The student does not need to complete Session 2.

The prerequisite is based on purchase, not completion.

14. SESSION EXPIRATION

Access expiration starts from the student's purchase date.

Not the publication date.

Example:

Student purchases a session on August 10.

Access period = 7 days.

The session expires on August 17.

Display the remaining access time clearly.

Examples:

6 days remaining

Expires tomorrow

Expired

If expired:

Lock protected content.

Prevent access.

Show expiration message.

15. MY LEARNING

Create a dedicated My Learning area containing all purchased sessions.

Organize them into:

In Progress

Completed

Expired

Each session displays:

Image

Name

Category

Progress percentage

Expiration status

Continue button

16. SESSION CONTENT PLAYER

When the student opens a purchased session, display its parts in the exact order defined by the admin.

Example:

Video

PDF

Test

Homework

Use a clear vertical lesson-progress interface.

Each part displays a status:

Locked

Available

In Progress

Completed

17. PART PROGRESSION

Required parts must be completed sequentially.

Example:

Part 1 → Part 2 → Part 3

The student cannot open Part 2 until Part 1 is completed.

Locked parts should clearly explain why they are locked.

Example:

Complete Part 1 to unlock this part.

Optional parts do not block progression.

18. VIDEO PART

Video content uses YouTube URLs.

Display:

Video title

Embedded YouTube player

Watch progress

Total watch duration

Number of opens used

Remaining allowed opens

Example:

Views: 1 / 2

If the maximum number of opens is reached:

Lock the video.

Show:

You have reached the maximum number of video openings allowed for this session. Please contact the admin if you need another attempt.

Track:

Watch duration

Progress percentage

Completion

Open count

The student must not be able to bypass the viewing restriction through normal UI behavior.

19. PDF PART

PDF parts allow:

In-platform PDF viewing

Download PDF

Display:

PDF name

Viewer

Download button

Completion status

PDF remains accessible only while the student's session access is valid.

20. TEST PART

Tests have:

Test title

Total degree

Passing degree

Duration

Questions

One attempt only

Before starting, show a test information screen:

Test: Mechanics Session 03

Questions

Total degree

Passing degree

Time limit

Attempts: 1

Show a clear warning:

You can attempt this test only once.

Require confirmation before starting.

21. TEST QUESTION TYPES

Support:

Multiple Choice

Display:

Question

Answer choices

Only one correct answer where configured.

Automatically grade the question.

Written Answer

Student enters a written response.

Admin grades manually.

Photo Upload

Student uploads a photo/image of their answer.

Admin grades manually.

22. TEST TIMER

Timed tests must have a visible countdown.

Example:

Time remaining: 14:32

When the timer reaches zero:

Automatically submit the test.

Prevent additional answers after submission.

23. TEST RESULT

After submission:

Show available results.

For automatically graded content:

Score

Total degree

Percentage

Pass/fail

For manually graded questions:

Show:

Waiting for teacher grading

until the admin completes grading.

Once grading is complete, show the final score.

24. ONE TEST ATTEMPT

A student receives exactly one attempt.

After submission:

The test cannot be restarted.

Do not show a "Retake" button.

The admin can manually reset/manage the student's test state from the admin dashboard if necessary.

25. FAILED TEST BEHAVIOR

If the student fails:

Allow them to continue to the next part.

Do NOT block progression because of the failed grade.

However, display a clear warning:

"You should return and study the previous session before continuing."

The failed grade remains visible in the student's learning record.

26. HOMEWORK PART

Homework supports two submission formats.

Test-style homework

Student answers structured questions.

PDF Upload

Student uploads their homework as a PDF.

Display:

Homework instructions

Submission area

Submission status

Submission date

Grade once available

After submitting:

Show submission confirmation.

Prevent unnecessary duplicate submissions unless the admin allows it.

27. HOMEWORK GRADING

Homework may require manual teacher grading.

Before grading:

Waiting for teacher grading

After grading:

Display:

Grade

Feedback if provided

Submission status

28. SESSION COMPLETION

Calculate progress based on required parts.

Example:

Session has 5 required parts.

Completed:
3

Progress:

60%

Show a progress bar throughout the session.

When all required parts are completed:

Mark:

Completed

29. WALLET PAGE

The Wallet page shows:

Current balance

Example:

400 EGP

Large, clear display.

Recharge

Student can enter any amount.

Examples:

100

250

500

1,250

No predefined recharge packages are required.

Button:

Recharge with Fawry

30. FAWRY RECHARGE FLOW

Flow:

Student enters amount.

Example:

300 EGP

Click:

Recharge with Fawry

Send the payment through the Fawry integration.

After successful payment confirmation:

Wallet automatically becomes:

Previous balance + recharge amount.

Example:

100 EGP + 300 EGP = 400 EGP

Do not credit the wallet before successful payment confirmation.

Prevent duplicate payment confirmation from crediting the wallet twice.

31. WALLET TRANSACTION HISTORY

Show:

Date

Transaction type

Description

Amount

Balance after transaction

Examples:

Fawry Recharge +300 EGP

Session Purchase −100 EGP

PDF Book −75 EGP

Refund +100 EGP

Use clear positive/negative transaction indicators.

32. BOOKS PAGE

The Books page shows books available for the student's level only.

Do not show books from other levels.

Provide tabs or filters:

All

Physical

Digital/PDF

33. DIGITAL BOOKS

Digital book cards display:

Cover

Name

Description

Price

Digital/PDF label

Student can purchase using wallet.

After successful purchase:

Wallet decreases by book price.

Book becomes available in the student's library.

Student can view/download the PDF.

34. PHYSICAL BOOKS

Physical book cards display:

Cover

Name

Description

Price

Physical Book label

Student can select quantity.

Example:

Quantity:
3

Calculate:

Unit Price × Quantity = Total

Before purchase show:

Current wallet

Total price

Remaining balance

35. PHYSICAL BOOK ORDER

When ordering a physical book, student provides:

Delivery address

Phone/contact information if required

Use the student's saved phone information where possible.

Before confirming:

Show:

Book:
Mechanics Book

Quantity:
2

Total:
300 EGP

Wallet after purchase:
200 EGP

Button:

Confirm Order

After successful purchase:

Show order confirmation.

36. BOOK ORDER HISTORY

Student can see their physical book orders.

Each order shows:

Order ID

Book

Quantity

Total

Delivery address

Order date

Delivery status

Statuses:

Processing

Delivered

37. STUDENT NOTIFICATIONS

Provide a notification center.

Notifications support:

Text

Optional image

Display:

Title

Message

Image if included

Date/time

Read/unread status

Notifications may be sent by the admin:

Individually

To multiple students

To an entire level

38. NOTIFICATION UI

Unread notifications should be visually distinguishable.

Show a notification indicator/badge in the header.

Clicking a notification opens its full content.

39. STUDENT SESSION STATUS

Clearly distinguish:

Available

Student can purchase/access.

Purchased

Student owns the session.

In Progress

Student has started it.

Completed

All required parts completed.

Locked

Prerequisite has not been purchased or previous required part is incomplete.

Expired

Access period has ended.

40. PURCHASE VS ATTENDANCE

Do not confuse online session purchase with physical attendance.

For online recorded sessions:

The platform tracks:

Purchased/not purchased

Progress

Watch duration

Completion

Test results

Homework

For physical events:

QR check-in records:

Student

Event/session

Present

Date

Time

41. RESPONSIVE DESIGN

Desktop:

Full navigation

Multi-column content

Full learning interface

Large video player

Tablet:

Adaptive layouts

Collapsible navigation

Touch-friendly controls

Mobile:

Compact navigation

Mobile-first session player

Full-width video

Stacked information

Easy wallet purchases

Easy PDF access

Touch-friendly test controls

Sticky important actions where useful

Do not simply shrink desktop screens.

Reflow the UI properly.

42. SECURITY / ACCESS CONTROL

Students must only access:

Their own account

Their own wallet

Their own purchases

Their own progress

Their own test attempts

Their own homework

Their own notifications

Their own level's content

Their own level's books

Never expose another student's data.

Never expose:

Parent phone numbers

Other students' transactions

Other students' grades

Admin-only information

43. LEVEL ACCESS CONTROL

The student's assigned level controls content visibility.

Example:

Student level:

3rd Secondary

They can see:

3rd Secondary categories

3rd Secondary sessions

3rd Secondary books

They cannot see:

2nd Secondary sessions

1st Secondary books

3rd Preparatory content

This filtering must happen at the application/data-access level, not only visually.

44. PURCHASE PROTECTION

Do not allow:

Purchasing with insufficient wallet balance

Purchasing unpublished sessions

Purchasing unavailable books

Purchasing another level's books

Purchasing a session whose prerequisite has not been purchased

After successful purchase:

Create transaction

Deduct wallet

Grant access

Start session expiration timer

All operations should be handled safely to prevent double purchases or incorrect balances.

45. EMPTY STATES

Create professional empty states.

Examples:

No purchased sessions:

"You haven't purchased any sessions yet."

Button:

Explore Classes

No notifications:

"You're all caught up."

No books:

"No books are currently available for your level."

No transactions:

"No wallet transactions yet."

46. LOADING / ERROR STATES

Use polished loading states and skeleton loaders.

Examples:

Loading session

Loading wallet

Loading books

Loading test

Processing payment

If an error occurs:

Show a clear user-friendly message.

Do not expose raw technical/database errors.

47. CONFIRMATION DIALOGS

Require confirmation for important student actions:

Session purchase

Book purchase

Physical book order

Starting one-attempt test

Submitting test

Final homework submission where applicable

Clearly display the consequences.

48. VISUAL DESIGN

Use a modern professional EdTech/SaaS aesthetic.

The platform should feel:

Premium

Trustworthy

Clean

Academic

Modern

Easy to use

Avoid:

Cartoonish school UI

Excessive colors

Gaming aesthetics

Excessive gradients

Excessive rounded cards

Clutter

Unnecessary animations

Use:

Strong typography

Clear hierarchy

Consistent spacing

Professional cards

Clean tables

Progress bars

Status badges

Subtle transitions

High-quality icons

The interface should be visually related to the admin dashboard so both sides feel like one unified product.

49. STUDENT EXPERIENCE PRIORITY

The student should always understand:

What level am I in?

What can I learn?

What have I purchased?

What should I continue?

What is locked and why?

How much wallet balance do I have?

What tests/homework do I need to complete?

How much progress have I made?

When does my access expire?

What notifications has the teacher sent?

Never hide important status information.

50. CORE STUDENT JOURNEY

The complete student journey should work like this:

Registration

Student registers.

↓

Account becomes pending.

↓

Admin approves.

↓

Student logs in.

↓

Home

Student sees:

Wallet

Progress

Continue Learning

Notifications

↓

Classes

Student selects:

Level

↓

Category

↓

Session

↓

Views session details.

↓

Checks price.

↓

Checks included content.

↓

Purchase

Student pays using wallet.

↓

Session becomes purchased.

↓

Expiration timer starts from purchase date.

↓

Learning

Student opens session.

↓

Part 1 available.

↓

Completes Part 1.

↓

Part 2 unlocks.

↓

Continues through ordered required parts.

↓

Video

Watches YouTube video.

↓

Watch progress recorded.

↓

View limit enforced.

↓

Test

Starts one-attempt test.

↓

Completes test.

↓

Automatically graded where possible.

↓

Manual grading where required.

↓

Result displayed.

↓

If failed:

Show study warning.

↓

Student can still continue.

↓

Homework

Student submits answers/PDF.

↓

Teacher grades.

↓

Grade appears in student's learning record.

↓

Completion

All required parts completed.

↓

Session becomes Completed.

51. FINAL PRODUCT GOAL

The finished student platform should feel like a real commercial online mathematics learning platform, not a simple course website.

The student should be able to complete the entire learning and purchasing journey without needing the admin except for:

Account approval

Device changes

Special access problems

Manual grading

Support/refunds where applicable

The platform must work seamlessly with the admin dashboard.

The admin controls the system.

The student experiences a simple, clean, focused learning environment.

Build the application with scalable structure and reusable components so additional levels, categories, sessions, books, students, and content can be added without redesigning the application.


make this with modern UI and user friendly layout and design

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bright-spark-ed.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2f762ecc-1043-478e-92e3-5b6b3fd56176).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
