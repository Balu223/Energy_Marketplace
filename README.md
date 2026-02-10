# Energy Marketplace

A layered web application that simulates a real‑world energy trading marketplace.
It’s primarily a learning project used for workplace training and experimentation.

# Features
## User Management

  User registration and login via Auth0

  Profile management (address, role, credits, etc.)

## Trading System

  Buy and sell energy products (e.g. electricity, natural gas, crude oil)

  Validations for balance, inventory, and market limits

  Transaction history persisted in the database

## Marketplace UI

  Interactive bar chart showing marketplace quantities

  “Current Market Prices” list under the chart

  Trade dialogs (Buy/Sell) with live total price calculation and feedback

## Tech Stack
  Backend: ASP.NET Core, Entity Framework Core, layered architecture (Controller → Service → Repository)

  Frontend: Angular, Angular Material, ng2‑charts

## Authentication: Auth0

## Database: PostgreSQL database accessed via EF Core migrations
