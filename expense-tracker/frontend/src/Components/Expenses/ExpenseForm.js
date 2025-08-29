import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';
import { useGlobalContext } from '../../context/globalContext';  // Assuming global context exists

function ExpenseForm() {
    const { addExpense, error, setError, fetchExpenses } = useGlobalContext();
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: null,
        category: '',
        description: '',
    });

    const { title, amount, date, category, description } = inputState;

    // Fetch expenses when component mounts
    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // Input handler
    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError('');  // Clear error on input change
    };

    const handleDateChange = (date) => {
        setInputState({ ...inputState, date });
        setError('');
    };

    // Form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !amount || !date || !category) {
            setError('Please fill in all fields');
        } else if (isNaN(amount) || Number(amount) <= 0) {
            setError('Please enter a valid positive number for the amount');
        } else {
            addExpense(inputState);
            setInputState({
                title: '',
                amount: '',
                date: null,
                category: '',
                description: '',
            });
        }
    };

    return (
        <ExpenseFormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input
                    type="text"
                    value={title}
                    name='title'
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                />
            </div>
            <div className="input-control">
                <input
                    type="text"
                    value={amount}
                    name='amount'
                    placeholder='Expense Amount'
                    onChange={handleInput('amount')}
                />
            </div>
            <div className="input-control">
                <DatePicker
                    id='date'
                    placeholderText='Enter A Date'
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={handleDateChange}
                />
            </div>
            <div className="selects input-control">
                <select value={category} name="category" onChange={handleInput('category')}>
                    <option value="" disabled>Select Option</option>
                    <option value="education">Education</option>
                    <option value="groceries">Groceries</option>
                    <option value="health">Health</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="takeaways">Takeaways</option>
                    <option value="clothing">Clothing</option>
                    <option value="travelling">Travelling</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="input-control">
                <textarea
                    name="description"
                    value={description}
                    placeholder='Add A Reference'
                    onChange={handleInput('description')}
                ></textarea>
            </div>
            <div className="submit-btn">
                <Button
                    name='Add Expense'
                    icon={plus}
                    bPad='.8rem 1.6rem'
                    bRad='30px'
                    bg='var(--color-accent)'
                    color='#fff'
                />
            </div>
        </ExpenseFormStyled>
    );
}

// Styled components
const ExpenseFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    
    input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    }

    .input-control input {
        width: 100%;
    }

    .selects select {
        width: 100%;
        color: rgba(34, 34, 96, 0.4);
    }

    .submit-btn button {
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    }
`;

export default ExpenseForm;
