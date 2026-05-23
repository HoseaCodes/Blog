import styled from "styled-components";

export default function StateFarm() {
    const PartnershipBanner = styled.section`
        height: 17rem;
        position: relative;
        padding: clamp(2.5rem, 4vw, 3.5rem) clamp(1.25rem, 3vw, 2.25rem);
        border-top: 1px solid rgba(239, 68, 68, 0.14);
        border-bottom: 1px solid rgba(239, 68, 68, 0.14);

        /* Soft gradient instead of flat color */
        background: radial-gradient(1200px 400px at 20% 20%, rgba(239, 68, 68, 0.10), transparent 60%),
                    radial-gradient(900px 300px at 90% 40%, rgba(2, 132, 199, 0.10), transparent 55%),
                    #fff;

        /* Subtle pattern texture */
        &::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image: radial-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px);
            background-size: 18px 18px;
            opacity: 0.35;
            pointer-events: none;
            mask-image: radial-gradient(600px 280px at 20% 30%, black 35%, transparent 75%);
        }
    `;

    const PartnershipContainer = styled.div`
        position: absolute;
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: clamp(1.5rem, 4vw, 3rem);

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
            text-align: center;
        }
    `;

    const PartnershipContent = styled.div`
        top: -158px;
        align-items: center;
        position: relative;
        display: flex;
        gap: 1.25rem;

        @media (max-width: 768px) {
            align-items: center;
            flex-direction: column;
            gap: 0.85rem;
        }
    `;

    const PartnershipText = styled.h3`
        width: max-content;
        left: -7rem;
        position: relative;
        margin: 0;
        color: #0f172a;
        font-weight: 800;
        line-height: 1.05;
        font-size: clamp(1.6rem, 2.6vw, 2.2rem);
        letter-spacing: -0.02em;

        .highlight {
            color: #ef4444;
            position: relative;
        }

        /* Underline accent */
        .highlight::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -0.18em;
            height: 0.28em;
            background: rgba(239, 68, 68, 0.18);
            border-radius: 999px;
            z-index: -1;
        }

        .sub {
            display: block;
            margin-top: 0.6rem;
            font-size: 0.98rem;
            font-weight: 550;
            line-height: 1.4;
            color: rgba(15, 23, 42, 0.72);
            letter-spacing: 0;
        }

        @media (max-width: 768px) {
            line-height: 1.1;
        }
    `;

    const PartnershipVisual = styled.div`
        top: -158px;
        left: -10rem;
        position: relative;
        display: grid;
        place-items: center;

        @media (max-width: 768px) {
            margin: 0 auto;
            width: 180px;
            height: 110px;
        }
    `;

  return (
    <PartnershipBanner>
        <PartnershipContainer>
            <PartnershipContent>
                <img style={{ borderRight: '2px solid gray'}} src="/State-Farm-Symbol.png" alt="State Farm Logo" width={100} height={100} />
                <img style={{ position: 'relative', left: '-5rem' }} src="/logo.png" alt="HC Logo" width={250} height={250} />
            <PartnershipText>
                State Farm takes off on{" "}
                <span className="highlight">enterprise scale</span>
                <span className="sub">Shipping resilient systems, one release at a time.</span>
            </PartnershipText>
            </PartnershipContent>

            <PartnershipVisual>
                <img src="/cloud.png" alt="State Farm Cloud" width={500} height={500} />
            </PartnershipVisual>
        </PartnershipContainer>
    </PartnershipBanner>
  )
}
