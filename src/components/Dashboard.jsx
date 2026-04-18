import { useState } from "react";
import { getbeneficiaries, finduserbyaccount, findbeneficiarieByid ,findcardsbyanumcards } from "../data/database";


export default function Dashboard({setLogin}){
  const [user, setUser] = useState(
  JSON.parse(sessionStorage.getItem("currentUser"))
);

const [showTransfer, setShowTransfer] = useState(false);
const [showRecharge, setShowRecharge] = useState(false);
const [transferData, setTransferData] = useState({
  beneficiary: "",
  sourceCard: "",
  amount: ""
});
const [rechargeData, setRechargeData] = useState({
  card: "",
  amount: ""
});

//Transfer *****************************
function checkUser(numcompte) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const destinataire = finduserbyaccount(numcompte);

      if (destinataire) {
        resolve(destinataire);
      } else {
        reject("Destinataire non trouvé");
      }
    }, 500);
  });
}

function checkSolde(exp, amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const soldeActuel = exp.wallet.balance;

      if (soldeActuel >= amount) {
        resolve("Solde suffisant");
      } else {
        reject("Solde insuffisant");
      }
    }, 400);
  });
}

function updateSolde(exp, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedUser = {
        ...exp,
        wallet: {
          ...exp.wallet,
          balance: exp.wallet.balance - amount
        }
      };

      resolve(updatedUser);
    }, 300);
  });
}

function addtransactions(updatedUser, beneficiaryName, amount, selectedCard) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactionDebit = {
        id: Date.now().toString(),
        type: "debit",
        amount: amount,
        from: selectedCard,
        to: beneficiaryName,
        date: new Date().toLocaleDateString()
      };

      const finalUser = {
        ...updatedUser,
        wallet: {
          ...updatedUser.wallet,
          transactions: [...updatedUser.wallet.transactions, transactionDebit]
        }
      };

      resolve(finalUser);
    }, 200);
  });
}

async function transferer(exp, numcompte, amount, selectedCard, beneficiaryName) {
  try {
    const destinataire = await checkUser(numcompte);
    console.log("Étape 1: Destinataire trouvé -", destinataire.name);

    const soldemessage = await checkSolde(exp, amount);
    console.log("Étape 2:", soldemessage);

    const updatedUser = await updateSolde(exp, amount);
    console.log("Étape 3: Solde mis à jour");

    const finalUser = await addtransactions(
      updatedUser,
      beneficiaryName,
      amount,
      selectedCard
    );
    console.log("Étape 4: Transaction enregistrée");

    setUser(finalUser);
    sessionStorage.setItem("currentUser", JSON.stringify(finalUser));

    setShowTransfer(false);
    setTransferData({
      beneficiary: "",
      sourceCard: "",
      amount: ""
    });

    alert(`Transfert de ${amount} réussi!`);
  } catch (error) {
    console.log("Erreur :", error);
    alert(error);
  }
}

function handleTransferSubmit(e) {
  e.preventDefault();

  const amount = Number(transferData.amount);

  if (!transferData.beneficiary) {
    alert("Choisir un bénéficiaire");
    return;
  }

  if (!transferData.sourceCard) {
    alert("Choisir une carte");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Montant invalide");
    return;
  }

  const beneficiaryObject = user.wallet.beneficiaries.find(
    (b) => b.id === transferData.beneficiary
  );

  if (!beneficiaryObject) {
    alert("Bénéficiaire introuvable");
    return;
  }

  transferer(
    user,
    beneficiaryObject.account,
    amount,
    transferData.sourceCard,
    beneficiaryObject.name
  );
}

//Recharger *********
function checkCard(numcards) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const card = findcardsbyanumcards(numcards);
      if (card) {
        resolve(card);
      } else {
        reject("Carte introuvable");
      }
    }, 400);
  });
}

function checkAmount(amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!isNaN(amount) && amount > 0) {
        resolve("Montant valide");
      } else {
        reject("Montant invalide");
      }
    }, 400);
  });
}

function checkExpiry(numcards) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const card = findcardsbyanumcards(numcards);
      const today = new Date();
      const expiryDate = new Date(card.expiry);

      if (expiryDate > today) {
        resolve("Carte valide");
      } else {
        reject("Carte expirée");
      }
    }, 400);
  });
}

function addbalance(user, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedUser = {
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance + amount
        }
      };

      resolve(updatedUser);
    }, 400);
  });
}

function addrechargetransaction(updatedUser, amount, cards) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = {
        id: Date.now().toString(),
        type: "recharge",
        amount: amount,
        date: new Date().toLocaleDateString(),
        from: cards,
        to: "Wallet"
      };

      const finalUser = {
        ...updatedUser,
        wallet: {
          ...updatedUser.wallet,
          transactions: [...updatedUser.wallet.transactions, transaction]
        }
      };

      resolve(finalUser);
    }, 400);
  });
}

async function recharge(user, cards, amount) {
  try {
    const selectedCard = await checkCard(cards);
    console.log("Etape 1 : carte trouvée");

    const messageAmount = await checkAmount(amount);
    console.log("Etape 2 :", messageAmount);

    const messageExpiry = await checkExpiry(selectedCard.numcards);
    console.log("Etape 3 :", messageExpiry);

    const updatedUser = await addbalance(user, amount);
    console.log("Etape 4 : solde ajouté");

    const finalUser = await addrechargetransaction(updatedUser, amount, cards);
    console.log("Etape 5 : transaction ajoutée");

    setUser(finalUser);
    sessionStorage.setItem("currentUser", JSON.stringify(finalUser));

    setShowRecharge(false);
    setRechargeData({
      card: "",
      amount: ""
    });

    alert(`Rechargement de ${amount} réussi!`);
  } catch (error) {
    console.log(error);
    alert(error);
  }
}


function handleRechargeSubmit(e) {
  e.preventDefault();

  const amount = Number(rechargeData.amount);

  if (!rechargeData.card) {
    alert("Doit sélectionner une carte");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Montant invalide");
    return;
  }

  recharge(user, rechargeData.card, amount);
}

//********************************************************* */

  if(!user){
    setLogin(false);
  }

  const monthlyIncom = user.wallet.transactions
    .filter(t => t.type === "credit")
    .reduce((total, t) => total + t.amount, 0);


  const monthlyExpense = user.wallet.transactions
    .filter(t => t.type === "debit")
    .reduce((total, t) => total + t.amount, 0);


  let userName=user.name;
  let availableBalance=`${user.wallet.balance} ${user.wallet.currency}`;
  let activeCards=user.wallet.cards.length;
  let monthlyIncome=`${monthlyIncom} ${user.wallet.currency}`;
  let monthlyExpenses=`${monthlyExpense} ${user.wallet.currency}`;

  
    return(
        <>
        <main className="dashboard-main">
    <div className="dashboard-container">

      <aside className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <a href="#overview">
                <i className="fas fa-home"></i>
                <span>Vue d'ensemble</span>
              </a>
            </li>
            <li>
              <a href="#transactions">
                <i className="fas fa-exchange-alt"></i>
                <span>Transactions</span>
              </a>
            </li>
            <li>
              <a href="#cards">
                <i className="fas fa-credit-card"></i>
                <span>Mes cartes</span>
              </a>
            </li>
            <li>
              <a href="#transfers">
                <i className="fas fa-paper-plane"></i>
                <span>Transferts</span>
              </a>
            </li>
            <li className="separator"></li>
            <li>
              <a href="#support">
                <i className="fas fa-headset"></i>
                <span>Aide & Support</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="dashboard-content">

        <section className="dashboard-section active">
          <div className="section-header">
            <h2>Bonjour, <span >{userName}</span> !</h2>
            <p className="date-display" id="currentDate"></p>
          </div>

          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon blue">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="card-details">
                <span className="card-label">Solde disponible</span>
                <span className="card-value" id="availableBalance">{availableBalance}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon green">
                <i className="fas fa-arrow-up"></i>
              </div>
              <div className="card-details">
                <span className="card-label">Revenus</span>
                <span className="card-value" id="monthlyIncome">{monthlyIncome}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon red">
                <i className="fas fa-arrow-down"></i>
              </div>
              <div className="card-details">
                <span className="card-label">Dépenses</span>
                <span className="card-value" id="monthlyExpenses">{monthlyExpenses}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon purple">
                <i className="fas fa-credit-card"></i>
              </div>
              <div className="card-details">
                <span className="card-label">Cartes actives</span>
                <span className="card-value" id="activeCards">{activeCards}</span>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Actions rapides</h3>
            <div className="action-buttons">
              <button className="action-btn" onClick={()=> setShowTransfer(true)}>
                <i className="fas fa-paper-plane"></i>
                <span>Transférer</span>
              </button>

              <button className="action-btn" onClick={()=> setShowRecharge(true)}>
                <i className="fas fa-plus-circle"></i>
                <span>Recharger</span>
              </button>

              <button className="action-btn" id="quickRequest">
                <i className="fas fa-hand-holding-usd"></i>
                <span>Demander</span>
              </button>
            </div>
          </div>

          <div className="recent-transactions">
            <div className="section-header">
              <h3>Transactions récentes</h3>
            </div>
            <div className="transactions-list">
  {user?.wallet?.transactions
    ?.slice()
    .reverse()
    .map((transaction) => {
      const sign =
        transaction.type === "credit" || transaction.type === "recharge"
          ? "+"
          : "-";

      const person = transaction.to || transaction.from || "Transaction";

      return (
        <div className="transaction-item" key={transaction.id}>
          <div className="transaction-info">
            <span className="transaction-name">{person}</span>
            <span className="transaction-date">{transaction.date}</span>
          </div>

          <div className={`transaction-amount ${transaction.type}`}>
            {sign}
            {transaction.amount} {user.wallet.currency}
          </div>
        </div>
      );
    })}
</div>
          </div>
        </section>

        <section id="cards" className="dashboard-section">
          <div claclassNamess="section-header">
            <h2>Mes cartes</h2>
            <button className="btn btn-secondary" id="addCardBtn">
              <i className="fas fa-plus"></i> Ajouter une carte
            </button>
          </div>

          <div className="cards-grid" id="cardsGrid">
            <div className="card-item">
              <div className="card-preview visa">
                <div className="card-chip"></div>
                <div className="card-number">?</div>
                <div className="card-holder">?</div>
                <div className="card-expiry">?</div>
                <div className="card-type">?</div>
              </div>
              <div className="card-actions">
                <button className="card-action" title="Définir par défaut">
                  <i className="fas fa-star"></i>
                </button>
                <button className="card-action" title="Geler la carte">
                  <i className="fas fa-snowflake"></i>
                </button>
                <button className="card-action" title="Supprimer">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

       {showTransfer && (<section id="transfer-section" className="transfer-section active">
          <div className="section-header">
            <h2>Effectuer un transfert</h2>
            <button className="btn btn-close" id="closeTransferBtn">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="transfer-container">
            <form id="transferForm" className="transfer-form">

              <div className="form-group">
                <label for="beneficiary">
                  <i className="fas fa-user"></i> Bénéficiaire
                </label>
                <select
  value={transferData.beneficiary}
  onChange={(e) =>
    setTransferData({ ...transferData, beneficiary: e.target.value })
  }
>
  <option value="">Choisir un bénéficiaire</option>
  {user.wallet.beneficiaries.map((b) => (
    <option key={b.id} value={b.id}>
      {b.name}
    </option>
  ))}
</select>
              </div>

              <div className="form-group">
                <label for="sourceCard">
                  <i className="fas fa-credit-card"></i> Depuis ma carte
                </label>
               <select value={transferData.sourceCard} onChange={(e) => setTransferData({ ...transferData, sourceCard: e.target.value }) }>
  <option value="">Sélectionner une carte</option>
  {user.wallet.cards.map((card) => (
    <option key={card.numcards} value={card.numcards}>
      {card.type} ****{card.numcards.slice(-4)}
    </option>
  ))}
</select>
              </div>

              <div className="form-group">
                <label for="amount">
                  <i className="fas fa-euro-sign"></i> Montant
                </label>
                <div className="amount-input">
                  <input type="number" value={transferData.amount} onChange={(e) => setTransferData({ ...transferData, amount: e.target.value }) } />
                  <span className="currency">MAD</span>
                </div>
              </div>

              <div className="form-options">
                <div className="checkbox-group">
                  <input type="checkbox" id="saveBeneficiary" name="saveBeneficiary" />
                  <label for="saveBeneficiary">Enregistrer ce bénéficiaire</label>
                </div>

                <div className="checkbox-group">
                  <input type="checkbox" id="instantTransfer" name="instantTransfer" />
                  <label for="instantTransfer">
                    Transfert instantané <span className="fee-badge">+13.4 MAD</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" id="cancelTransferBtn" onClick={()=>setShowTransfer(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" onClick={handleTransferSubmit}>
                  <i className="fas fa-paper-plane"></i> Transférer
                </button>
              </div>

            </form>
          </div>
        </section>)}

       {showRecharge && (<section id="recharge-section" className="transfer-section active">
  <div className="section-header">
    <h2>Effectuer un rechargement</h2>
    <button className="btn btn-close" id="closeRechargeBtn">
      <i className="fas fa-times"></i>
    </button>
  </div>

  <div className="transfer-container">
    <form id="rechargeForm" className="transfer-form">

      <div className="form-group">
        <label for="rechargeCard">
          <i className="fas fa-credit-card"></i> Depuis ma carte
        </label>
        <select value={rechargeData.card} onChange={(e) => setRechargeData({ ...rechargeData, card: e.target.value }) }>
  <option value="">Sélectionner une carte</option>
  {user.wallet.cards.map((card) => (
    <option key={card.numcards} value={card.numcards}>
      {card.type} ****{card.numcards.slice(-4)}
    </option>
  ))}
</select>
      </div>

      <div className="form-group">
        <label for="rechargeAmount">
          <i className="fas fa-euro-sign"></i> Montant
        </label>
        <div className="amount-input">
          <input type="number"
  value={rechargeData.amount}
  onChange={(e) =>
    setRechargeData({ ...rechargeData, amount: e.target.value })
  }
/>
          <span className="currency">MAD</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" id="cancelRechargeBtn" onClick={()=>setShowRecharge(false)}>
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" onClick={handleRechargeSubmit}>
          <i className="fas fa-plus-circle"></i> Recharger
        </button>
      </div>

    </form>
  </div>
</section>)}

      </div>
    </div>
  </main>
        </>
    )
}