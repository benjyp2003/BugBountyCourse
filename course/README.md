# Course authoring

The course is authored as structured versioned data described in [CONTENT_MODEL.md](../docs/course-design/CONTENT_MODEL.md). No lessons are implemented yet.

When implementation begins, introduce `public/` for learner-visible course/week/lesson data and `private/` for revision-matched answer keys and private grading definitions. platform-api validates both and serves an explicit public projection. web must not import this tree or copy private content into assets.

V1 content covers Weeks 1–2. Publish immutable revisions with stable lesson/activity IDs, reviewed objectives, evidence-focused reasoning exercises, and explicit completion policies. Larger curriculum plans remain in [ROADMAP.md](../ROADMAP.md).
