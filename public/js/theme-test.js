window.onload = function () {
  const comments = [
    {
      username: 'Maria Smantha',
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp',
      time: '2 hours ago',
      message:
        'It is a long established fact that a reader will be distracted by the readable content of a page.',
      replies: [
        {
          username: 'Simona Disa',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(11).webp',
          time: '3 hours ago',
          message:
            'letters, as opposed to using "Content here, content here", making it look like readable English.',
        },
        {
          username: 'John Smith',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp',
          time: '4 hours ago',
          message:
            'the majority have suffered alteration in some form, by injected humour, or randomised words.',
        },
      ],
    },
    {
      username: 'Natalie Smith',
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(12).webp',
      time: '2 hours ago',
      message:
        'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33.',
      replies: [
        {
          username: 'Lisa Cudrow',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(31).webp',
          time: '4 hours ago',
          message:
            'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo.',
        },
        {
          username: 'Maggie McLoan',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(29).webp',
          time: '5 hours ago',
          message:
            'a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur.',
        },
        {
          username: 'John Smith',
          avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp',
          time: '6 hours ago',
          message:
            'Autem, totam debitis suscipit saepe sapiente magnam officiis quaerat necessitatibus odio assumenda, perferendis quae iusto labore laboriosam minima numquam impedit quam dolorem!',
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
};

function createCommentElement(comment, isReply = false) {
  const div = document.createElement('div');
  div.className = 'd-flex flex-start mt-4';
  if (isReply) {
    div.className += ' ms-5';
  }

  const avatar = document.createElement('img');
  avatar.className = 'rounded-circle shadow-1-strong me-3';
  avatar.src = comment.avatar;
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
  if (isReply) {
    header.appendChild(replyLink);
  }
  content.appendChild(header);
  content.appendChild(message);

  div.appendChild(avatar);
  div.appendChild(content);

  return div;
}
