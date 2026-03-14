# Security Rating

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Security Rating page assesses your NexappOS router's overall security posture by running a series of automated checks against best practices. Each check evaluates a specific security control (such as whether the default password was changed, whether IPS is enabled, or whether SSH uses key-based authentication). The results are presented as a numeric score out of 100, a letter grade, and a list of actionable recommendations.

Use this page periodically to identify security gaps and track your compliance improvements over time.

## How to Use

Navigate to **Security > Rating**.

### Running a Security Check

1. Click **Run Security Check** in the top-right corner.
2. The system evaluates all security controls. This takes a few seconds.
3. Results appear once the check completes.

### Reading the Results

**Score Card:** Displays your security score (0--100) with a color-coded indicator:

| Score Range | Color | Grade |
|---|---|---|
| 80--100 | Green | A |
| 60--79 | Yellow | B |
| 40--59 | Orange | C |
| 0--39 | Red | D/F |

**Check Results:** Shows the count of passed, failed, and total checks, along with a progress bar.

### Security Checks Table

Each row in the table represents one security check:

| Column | Description |
|---|---|
| **Check** | The name of the security control being evaluated. |
| **Description** | What the check verifies. |
| **Severity** | The importance level: **Critical**, **High**, **Medium**, or **Low**. |
| **Weight** | How many points this check contributes to the overall score. |
| **Status** | **PASS** (green) or **FAIL** (red). |

### Recommendations

Below the checks table, the **Recommendations** section lists specific actions you can take to improve your score. Each recommendation shows:

| Column | Description |
|---|---|
| **Issue** | The security gap identified. |
| **Severity** | How critical the issue is. |
| **Impact** | How many points you gain by resolving it. |
| **Action** | The specific step to take (e.g., "Enable IPS on all zones"). |

Focus on **Critical** and **High** severity recommendations first for the greatest score improvement.

## Verification

1. After resolving a recommendation, click **Run Security Check** again.
2. Confirm the previously-failed check now shows **PASS**.
3. Verify your overall score has increased by the expected number of points.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Score does not change after applying a fix | The security check was not re-run after the change. | Click **Run Security Check** to re-evaluate. |
| "Failed to load security rating" error | The security rating service is not available. | Verify the router is running NexappOS 10.01 or later. Reboot the router if the issue persists. |
| A check shows FAIL but the feature is enabled | The check evaluates a specific configuration detail, not just the feature toggle. | Read the check description carefully -- it may require a specific setting (e.g., "SSH key-only auth" vs. just "SSH enabled"). |

## See Also

- [Security Analytics](analytics.md)
- [SSH Access](../03-system/ssh.md)
- [IPS](ips.md)
- [Threat Shield DNS](threat-shield-dns.md)
