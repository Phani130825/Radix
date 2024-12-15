import React from 'react';
import '../styles/UserManual.css';

const UserManual = () => {
  const steps = [
    { step: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', video: 'video1.mp4' },
    { step: 2, text: 'Suspendisse euismod, nisl eget luctus laoreet, enim velit varius justo.', video: 'video2.mp4' },
    { step: 3, text: 'Phasellus aliquam nunc sit amet erat bibendum, non cursus nisi posuere.', video: 'video3.mp4' },
    { step: 4, text: 'Curabitur vel urna eget libero ultricies facilisis at nec justo.', video: 'video4.mp4' },
    { step: 5, text: 'Mauris placerat ipsum in urna tincidunt, vel condimentum purus convallis.', video: 'video5.mp4' },
    { step: 6, text: 'Aenean tincidunt ligula eget risus ullamcorper ultricies.', video: 'video6.mp4' },
  ];

  return (
    <div className="user-manual-container">
      <h1 className="manual-title">Radix: User Manual</h1>
      <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem fugiat beatae totam fuga quisquam quidem ratione laudantium iure optio nesciunt doloremque quis tempore commodi illum quibusdam, omnis maxime, quia id?
      </p>
      {steps.map((item) => (
        <div key={item.step} className="manual-step">
          <div className="step-icon">
            <span>STEP</span>
            <h2>{item.step}</h2>
          </div>
          <div className="step-content">
            <h3>Step {item.step}</h3>
            <p>{item.text}</p>
            <video
              src={item.video}
              autoPlay
              loop
              muted
              className="step-video"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserManual;
