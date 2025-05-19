// components/reviewCard.js
export const createReviewCard = (review, jobTitle, company) => {
  const reviewItem = document.createElement('div');
  reviewItem.className = 'reviews__item';
  reviewItem.dataset.id = review.id;

  const formatDuration = (duration) => {
    const formats = {
      LESS_THAN_A_YEAR: 'Less than a year',
      ONE_TO_THREE_YEARS: '1-3 years',
      THREE_TO_FIVE_YEARS: '3-5 years',
      MORE_THAN_FIVE_YEARS: 'More than 5 years',
    };
    return formats[duration] || duration;
  };

  const formatEmploymentType = (type) => {
    return type
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const isAnonymous =
    review.anonymous === true ||
    review.anonymous === 1 ||
    review.anonymous === '1';

  reviewItem.innerHTML = `
    <p class="reviews__date">
      <span>📅</span> ${new Date(review.created_at).toLocaleDateString('sr-RS')}
    </p>

    <div class="reviews__rating-container">
      <p class="reviews__rating">
        <span>⭐</span> ${review.rating}
      </p>
      <p class="reviews__recommend">
        <span>👍</span> ${review.recommend === 'YES' ? 'Recommends' : "Doesn't recommend"}
      </p>
    </div>

    ${jobTitle ? `<h4>${jobTitle}</h4>` : ''}
    ${
      company
        ? `
      <a href="/company/${review.company_id}/about" class="reviews__company">
        ${company}
      </a>
    `
        : ''
    }

    ${
      review.positive_review
        ? `
      <p class="reviews__positive">
        <strong>Positive:</strong> ${review.positive_review}
      </p>
    `
        : ''
    }

    ${
      review.negative_review
        ? `
      <p class="reviews__negative">
        <strong>Negative:</strong> ${review.negative_review}
      </p>
    `
        : ''
    }

    <div class="review__tags">
      <span class="review__tag">
        ${formatEmploymentType(review.employment_type)}
      </span>
      <span class="review__tag">
        ${formatDuration(review.employment_duration)}
      </span>
    </div>

    <div class="reviews__info">
      <span>${review.currently_working === 'YES' ? 'Current employee' : 'Former employee'}</span>
      <span class="reviews__separator">•</span>
      <!-- TODO: add username instead of user id -->
      <span>Posted by ${isAnonymous ? 'Anonymous User' : `User #${review.user_id}`}</span>

    </div>
  `;

  return reviewItem;
};
