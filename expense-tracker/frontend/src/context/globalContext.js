import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';

// Base URL for the API
const BASE_URL = "http://localhost:5000/api/v1/";

// Create GlobalContext
const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Fetch incomes and expenses when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            await getIncomes();
            await getExpenses();
        };
        fetchData();
    }, []);

    // Add Income
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            await getIncomes(); // Refresh incomes after adding
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while adding income');
        }
    };

    // Get all Incomes
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching incomes');
        }
    };

    // Delete Income by ID
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            await getIncomes(); // Refresh incomes after deletion
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while deleting income');
        }
    };

    // Calculate total income
    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    // Add Expense
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            await getExpenses(); // Refresh expenses after adding
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while adding expense');
        }
    };

    // Get all Expenses
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching expenses');
        }
    };

    // Delete Expense by ID
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            await getExpenses(); // Refresh expenses after deletion
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while deleting expense');
        }
    };

    // Calculate total expenses
    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    // Calculate total balance (income - expenses)
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Get a sorted list of transaction history (latest 3)
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date
        return history.slice(0, 3); // Return the last 3 transactions
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook to access the GlobalContext
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
