---
layout: ../layouts/PageLayout.astro
title: Privacy policy.
footerLabel: Privacy · Draft
footerOrder: 2
description: Draft privacy policy describing Along the Way account data, family records, image processing, village sharing, and account deletion.
intro: A plain-language draft of how the current app handles information.
eyebrow: FAMILY PRIVACY
draft: true
noindex: true
---

> **DRAFT — FOR OWNER AND LEGAL REVIEW.** This document has not been adopted as a final privacy policy and has no effective date. The operator’s legal identity and contact details, applicable privacy obligations, operational-log and backup retention, and procedures for privacy requests still need owner and legal review. It describes the current app implementation, not a certification of compliance.

## Information in the app

Along the Way is a parent-operated homeschool app. Parents provide an email address, display name, family name, and, for password accounts, a password. The server stores a password hash rather than the password itself. Apple or Google sign-in uses the relevant provider’s account identifier and email information. An Apple refresh token may be stored for token revocation; Google sign-in tokens are not stored as ongoing account credentials.

The app stores a child’s first name and optional grade level. Its child-profile fields do not request a child’s email address, birthdate, or last name. Child sign-in is not currently built.

The records you choose to enter can include:

- Home state and instruction option, family settings, school-year dates, and custom targets.
- Subjects, learning dates and duration, children included in an activity, home/away status, lesson descriptions, and notes.
- Planned lessons and completion links to logged learning time.
- Optional courses, assignments, grades and earlier grades, and attendance.
- Keepsake images, lesson-photo attachments, titles, notes, and dates.
- Bible chapters marked read and their reading dates, for the family or a child.
- Family join invitations, village connections, referral-credit records, shared village photos, and reports of those photos.

The app also stores account and record identifiers, timestamps, hashed session credentials, and hashed email-verification or password-reset codes. Your mobile device keeps its sign-in credential and Bible translation preference in the device’s secure storage.

## How information is used

These records are used to operate accounts, authenticate requests, send account-verification and password-reset messages, calculate learning progress, show plans and saved work, record Bible reading, and provide family joining and village connections. Photos are processed for storage and display. Photo reports are stored and used to hide a reported image from the reporting family.

## The Family Wall

Children’s academic records, plans, keepsakes, lesson photos, and Bible reading progress are available only through the owning family’s signed-in accounts. Connecting to another family in a village does not grant access to those records.

Connected families can see a family’s name and its parents’ display names. A village code allows its holder to connect without a separate approval step, so share your code thoughtfully. Either family can remove the connection.

## Village photos

A parent can deliberately share photos with the family’s village. The sharing family and directly connected families can access them. Village photos can depict children, but the app does not attach a child’s record, name, tag, or caption to a shared photo.

Upload processing re-encodes the image as a JPEG and creates a thumbnail. It removes EXIF metadata, including embedded GPS/location information; a colour profile may be preserved. This does not remove information visible in the picture itself, such as a house number, school name, or landmark. The same processing is used for keepsakes and lesson photos.

Village photos expire after **21 days**. Expired photos stop being available through the app’s photo routes, and a background process removes their stored rows and files. The sharing family can delete a photo sooner. Removing a village connection ends the app’s access permission for the disconnected family.

Other parents may save a copy while a photo is available. The app cannot recall a downloaded copy after deletion, expiry, or disconnection. A photo report hides the image from the reporting family; it is not automatic removal for every family. The owner’s broader report-review process is still under review.

Keepsakes and lesson-photo attachments are separate from village photos. They are not subject to the village-photo expiry period and remain inside the family until deleted with the relevant record, child, or family.

## Services involved

The app uses its hosted API, database, and image storage to provide its features. Cloudflare carries traffic to the API. Resend processes account-verification and password-reset email delivery. Apple and Google process their respective sign-in flows when selected. Those providers’ own privacy practices also apply to their services.

The operator still needs to finalize the service-provider disclosures, hosting location, log retention, and any relevant international-transfer information before adopting this policy. This draft does not claim that information is end-to-end encrypted or that all operational data is anonymous.

## Retention and deletion

Records generally stay in the live app until you delete them or the relevant parent, child, or family is removed. Village photos have the expiry described above. Session credentials and emailed codes have expiry times; expiry does not by itself establish when all historical database rows are purged.

Use **Settings → Delete account** to delete your parent account. If another parent remains, your family’s shared records and photos remain. If you are the last parent, deletion removes the family’s live records and associated stored image files. See the [complete deletion instructions](/delete-account/).

Existing backups and operational logs are separate from the live records. Their retention and deletion procedures have not yet been finalized for this policy. This draft therefore does not promise immediate erasure from every backup, provider system, or device that received a downloaded copy.

## This website

The marketing website has no account forms, analytics scripts, tracking pixels, cookies, embedded third-party media, or third-party font requests. Its images, styles, and fonts are served locally or supplied by your device. Email links open your own email application; messages you send are handled by the email services involved.

When this site is hosted on GitHub Pages, GitHub logs visitors’ IP addresses for security purposes. See [GitHub’s Pages data-collection notice](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection) and [GitHub’s privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Questions and requests

Contact **[support@alongtheway.cc](mailto:support@alongtheway.cc)** with questions or to ask for help accessing or deleting records. The owner still needs to finalize identity-verification procedures and any legally required response deadlines. Please do not send passwords, sign-in codes, children’s private records, or photos in an initial message.

Before adoption, this draft needs review of children’s privacy, consent and notices, applicable access/deletion rights, retention, and the operator’s legal details. It does not state that those processes are already implemented.
