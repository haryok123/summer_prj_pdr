let replyButtonClicked = false;

window.onload = function () {
  const comments = getInitialComments();
  const commentsContainer = document.getElementById('commentsContainer');
  renderComments(comments, commentsContainer);
  setupPostCommentButton();
};

function getInitialComments() {
  const comments = localStorage.getItem('comments');
  return comments
    ? JSON.parse(comments)
    : [
        {
          comment_id: 1,
          question: { q_id: 101, theme_id: 201 },
          user: { user_login: 'Oliver Smith', avatar: 9 },
          parent_comment_id: null,
          comment_text:
            'Thank you very much for this site. I am real PDR enjoyer!',
          comment_date: new Date('2023-06-07T14:48:00.000Z'),
          replies: [
            {
              comment_id: 2,
              question: { q_id: 101, theme_id: 201 },
              user: { user_login: 'Pes Patron', avatar: 7 },
              parent_comment_id: 1,
              comment_text: 'Woof-woof!',
              comment_date: new Date('2023-06-07T17:48:00.000Z'),
            },
            {
              comment_id: 3,
              question: { q_id: 101, theme_id: 201 },
              user: { user_login: 'Barsyk', avatar: 6 },
              parent_comment_id: 1,
              comment_text: 'Meow meow!',
              comment_date: new Date('2023-06-07T16:48:00.000Z'),
            },
          ],
        },
        // Other comments
      ];
}

function renderComments(comments, container) {
  container.innerHTML = '';
  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    container.appendChild(commentElement);
  });
}

function setupPostCommentButton() {
  document.getElementById('postCommentButton').onclick = function () {
    const newCommentText = document.getElementById('newComment').value;
    if (newCommentText.trim() !== '') {
      postComment(newCommentText, data.currentUser, data.currentQuestion);
    }
  };
}

async function postComment(commentText, user, question) {
  const newComment = {
    user: { user_login: user.user_login, avatar: user.user_photo },
    parent_comment_id: null,
    comment_text: commentText,
    comment_date: new Date(),
    replies: [],
  };

  try {
    const response = await fetch(
      'http://localhost:19429/comments/createComment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_txt: commentText,
          q_id: question.q_id,
          theme_id: question.theme_id,
          user_login: user.user_login,
          parent_comment_id: null,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const savedComment = await response.json();
    const comments = getInitialComments();
    comments.push(savedComment);
    localStorage.setItem('comments', JSON.stringify(comments));
    const commentsContainer = document.getElementById('commentsContainer');
    renderComments(comments, commentsContainer);
    document.getElementById('newComment').value = '';
  } catch (error) {
    console.error('Failed to post comment:', error);
  }
}

function createCommentElement(comment, isReply = false) {
  const div = document.createElement('div');
  div.className = 'd-flex flex-start mt-4';
  console.log(comment.comment_id);
  div.setAttribute('data-comment-id', comment.comment_id);
  if (isReply) {
    div.className += ' ms-5';
  }

  const avatar = document.createElement('img');
  avatar.className = 'rounded-circle shadow-1-strong me-3';
  avatar.src = `/images/avatar${comment.user.avatar}.gif`; // Use number to load avatar
  avatar.alt = 'avatar';
  avatar.width = 65;
  avatar.height = 65;

  const content = document.createElement('div');
  content.className = 'flex-grow-1 flex-shrink-1';

  const contentDiv = document.createElement('div');

  const header = document.createElement('div');
  header.className = 'd-flex justify-content-between align-items-center';

  const nameTime = document.createElement('p');
  nameTime.className = 'mb-1';
  nameTime.textContent = `${comment.user.user_login} - ${formatDate(comment.comment_date)}`;

  const replyLink = document.createElement('a');
  if (!isReply) {
    replyLink.href = '#!';
    replyLink.setAttribute('data-username', comment.user.user_login);
    replyLink.innerHTML =
      '<i class="fas fa-reply fa-xs"></i><span class="small"> reply</span>';
    replyLink.onclick = function () {
      if (!replyButtonClicked)
        handleReplyClick(replyLink, contentDiv, content, comment.comment_id);
    };
  }

  const message = document.createElement('p');
  message.className = 'small mb-0';
  message.textContent = comment.comment_text;

  header.appendChild(nameTime);
  if (!isReply) {
    header.appendChild(replyLink);
  }
  contentDiv.appendChild(header);
  contentDiv.appendChild(message);

  div.appendChild(avatar);
  div.appendChild(content);

  // Render replies
  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach((reply) => {
      const replyElement = createCommentElement(reply, true);
      contentDiv.appendChild(replyElement);
    });
  }

  content.appendChild(contentDiv);
  return div;
}

function handleReplyClick(replyLink, content, parentDiv, comment_id) {
  const replyInput = document.createElement('div');
  replyInput.className = 'reply-input mt-2';
  replyInput.innerHTML = `
    <textarea class="form-control" rows="2" placeholder="Write a reply..."></textarea>
    <button class="btn btn-sm btn-primary mt-2 post-reply-button">Reply</button>
  `;
  content.appendChild(replyInput);
  replyInput.querySelector('.post-reply-button').onclick = function () {
    handlePostReply(replyLink, replyInput, parentDiv, comment_id);
  };
  replyButtonClicked = true;
}

async function handlePostReply(replyLink, replyInput, parentDiv, comment_id) {
  const replyText = replyInput.querySelector('textarea').value;
  if (replyText.trim() !== '') {
    const comments = getInitialComments();
    const parentCommentId = parseInt(comment_id, 10);
    const parentComment = findCommentById(comments, parentCommentId);
    if (parentComment) {
      const newReply = {
        question: { q_id: 101, theme_id: 201 },
        user: { user_login: 'Current User', avatar: 1 },
        parent_comment_id: parentCommentId,
        comment_text: `@${replyLink.getAttribute('data-username')}: ${replyText}`, // Mention the user being replied to
        comment_date: new Date(),
        replies: [],
      };
      parentComment.replies.push(newReply);
      localStorage.setItem('comments', JSON.stringify(comments));
      const commentsContainer = document.getElementById('commentsContainer');
      renderComments(comments, commentsContainer);
      replyButtonClicked = false;
      replyInput.remove();
    } else {
      console.error(`Parent comment with ID ${parentCommentId} not found`);
    }
  } else {
    replyButtonClicked = false;
    replyInput.remove();
  }
}

function findCommentById(comments, id) {
  for (const comment of comments) {
    if (comment.comment_id === id) {
      return comment;
    }
    for (const reply of comment.replies) {
      if (reply.comment_id === id) {
        return reply;
      }
    }
  }
  return null;
}

function formatDate(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}
