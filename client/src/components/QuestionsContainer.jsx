import './QuestionsContainer.css';
import Question from './Question';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useUserStore from '../stores/userStore';


function QuestionsContainer({
    questions,
    handleSubmitQuestion,
    handleAnswerQuestion,
    loggedIn,
}) {
    const [selectedQuestion, setSelectedQuestion] = useState('');
    // Double loading of reset and form state as recommended in docs
    // https://react-hook-form.com/api/useform/reset/
    const {
        register,
        reset,
        handleSubmit,
        formState,
        formState: { errors, isSubmitSuccessful },
    } = useForm();
    const {
        reset: reset2,
        register: register2,
        handleSubmit: handleSubmit2,
        formState: formState2,
        formState: { errors: errors2, isSubmitSuccessful: isSubmitSuccessful2 },
    } = useForm();

    const { anonymous } = useUserStore(store => ({ anonymous: store.anonymous }))

    const onSubmit = (data) => {
        handleSubmitQuestion(data.questionInput);
    };

    const onSubmit2 = (data) => {
        handleAnswerQuestion(selectedQuestion, data.answerInput);
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({ questionInput: ''});
        }
    }, [formState, reset])

    useEffect(() => {
        if (isSubmitSuccessful2) {
            reset2({ answerInput: ''});
        }
    }, [formState2, reset2])

    return (
        <div className='mx-4'>
            <div className='questionsContainer p-4 rounded my-4'>
                {questions && (
                    <div>
                        <h3>Questions</h3>
                        <p className='py-2'>Select a question to answer</p>
                    </div>
                )}
                {questions ? (
                    Array.from(questions).map((question, idx) => {
                        return (
                            <Question
                                key={idx}
                                {...question}
                                loggedIn={loggedIn}
                                setSelectedQuestion={setSelectedQuestion}
                                selected={selectedQuestion === question._id}
                            />
                        );
                    })
                ) : (
                    <></>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='input-group' id='questionInputBox'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Ask a question'
                            aria-label='Ask a question'
                            aria-describedby='button-addon'
                            {...register('questionInput', { required: true })}
                        />
                        <input
                            type='submit'
                            className='btn btn-outline-secondary'
                            id='button-addon'
                        />
                    </div>
                    {errors.questionInput && (
                        <span className='errorText'>This field is required</span>
                    )}
                </form>
            </div>

            {selectedQuestion !== '' && !anonymous && (
                <div className='answersContainer p-4 rounded'>
                    <form onSubmit={handleSubmit2(onSubmit2)}>
                        <p>
                            If you've already answered this question before, your new answer
                            will replace the old one!
                        </p>
                        <div className='input-group' id='questionInputBox'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Answer selected question'
                                aria-label='Ask a question'
                                aria-describedby='button-addon'
                                {...register2('answerInput', { required: true })}
                            />
                            <input
                                type='submit'
                                className='btn btn-outline-secondary'
                                id='button-addon'
                            />
                        </div>
                        {errors2.answerInput && (
                            <span className='errorText'>This field is required</span>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}

export default QuestionsContainer;
