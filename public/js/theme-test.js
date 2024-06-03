document.addEventListener('DOMContentLoaded', function () {
  const comments = [
    {
      username: 'Oliver Smith',
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp',
      time: '8 hours ago',
      message: 'Thank you very much for this site. I am real PDR enjoyer!',
      replies: [
        {
          username: 'Pes Patron',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(11).webp',
          time: '3 hours ago',
          message: 'Woof-woof!',
        },
        {
          username: 'Barsyk',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp',
          time: '4 hours ago',
          message: 'Meow meow!',
        },
      ],
    },
    {
      username: 'Joe Biden',
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp',
      time: '2 hours ago',
      message:
        "Why are the pictures for the questions out of place? I don't understand anything",
      replies: [
        {
          username: 'Donald Duck',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(11).webp',
          time: '1 hours ago',
          message: 'They are too lazy, 100%',
        },
      ],
    },
    {
      username: 'Ihor Haryshyn',
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(12).webp',
      time: '2 hours ago',
      message:
        'I am tired of doing this piece of... clean and smart code. Yes.',
      replies: [
        {
          username: 'oksanaUA',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(31).webp',
          time: '4 hours ago',
          message: 'LMAO. cry more',
        },
        {
          username: 'hater',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(29).webp',
          time: '5 hours ago',
          message: 'my summer project is better in one million times, lol',
        },
        {
          username: 'Denyska',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp',
          time: '6 hours ago',
          message: 'I am too bro!',
        },
      ],
    },
  ];

  const commentsContainer = document.getElementById('commentsContainer');

  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsContainer.appendChild(commentElement);

    comment.replies.forEach((reply) => {
      const replyElement = createCommentElement(reply, true);
      commentsContainer.appendChild(replyElement);
    });
  });

  // Handle posting a new comment
  document
    .getElementById('postCommentButton')
    .addEventListener('click', function () {
      const newCommentText = document.getElementById('newComment').value;
      if (newCommentText.trim() !== '') {
        const newComment = {
          username: 'Current User',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(1).webp', // URL for current user's avatar
          time: 'Just now',
          message: newCommentText,
          replies: [],
        };
        const newCommentElement = createCommentElement(newComment);
        commentsContainer.appendChild(newCommentElement);

        // Clear the textarea
        document.getElementById('newComment').value = '';
      }
    });
});

function createCommentElement(comment, isReply = false) {
  const div = document.createElement('div');
  div.className = 'd-flex flex-start mt-4';
  if (isReply) {
    div.className += ' ms-5';
  }
  random = Math.floor(Math.random() * 9) + 1;
  const avatar = document.createElement('img');
  avatar.className = 'rounded-circle shadow-1-strong me-3';

  avatar.src = '/images/avatar' + random + '.gif';
  avatar.alt = 'avatar';
  avatar.width = 65;
  avatar.height = 65;

  const content = document.createElement('div');
  content.className = 'flex-grow-1 flex-shrink-1';

  const header = document.createElement('div');
  header.className = 'd-flex justify-content-between align-items-center';

  const nameTime = document.createElement('p');
  nameTime.className = 'mb-1';
  nameTime.textContent = `${comment.username} - ${comment.time}`;

  const replyLink = document.createElement('a');
  if (!isReply) {
    replyLink.href = '#!';
    replyLink.innerHTML =
      '<i class="fas fa-reply fa-xs"></i><span class="small"> reply</span>';
  }
  const message = document.createElement('p');
  message.className = 'small mb-0';
  message.textContent = comment.message;

  header.appendChild(nameTime);
  if (!isReply) {
    header.appendChild(replyLink);
  }
  content.appendChild(header);
  content.appendChild(message);

  div.appendChild(avatar);
  div.appendChild(content);

  return div;
}
