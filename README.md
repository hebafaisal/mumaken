# Who are mumaken team?

Our team consists of 5 memers with differend tracks:
1. Heba - Software Engineering 
2. Fatimah - Product Management
3. Reema - Product Management
4. Abdulrahman - Artificial Intelligence
5. Saad - UI/UX

# Objective

Our objective is to create a robust, user-friendly payment orchestration platform that ensures seamless transaction processing by integrating multiple gateways, providing failover mechanisms, and optimizing costs—all while delivering an intuitive and engaging user experience.


# What is the problem

 Payment orchestration platforms face challenges with gateway downtime and varying pricing structures. When a primary gateway fails, transactions may be disrupted without a failover system. Additionally, inconsistent pricing models across gateways make cost optimization difficult.

# Solution

1. Multi-Gateway Integration with Failover Mechanisms
Using NestJS to build a backend that integrates multiple payment gateways (e.g., Mada, STC Pay, HyperPay). In case of failure, use an AI model to determine which gateway to route the payment to based on cost, availability, and performance.

2. Cost-Based Routing with AI Optimization
Using the AI model to predict the least expensive gateway for each transaction, based on transaction amount, type (local or international), and currency.