package com.flowgence.heartrisk.domain.profile;

import com.flowgence.heartrisk.domain.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import com.flowgence.heartrisk.domain.auth.User;

@Entity
@Table(name = "user_profiles")
public class UserProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "sex", length = 20)
    private String sex;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "height_cm")
    private Integer heightCm;

    @Column(name = "weight_kg")
    private Integer weightKg;

    protected UserProfile() {
    }

    public UserProfile(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public String getSex() {
        return sex;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public Integer getHeightCm() {
        return heightCm;
    }

    public Integer getWeightKg() {
        return weightKg;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setHeightCm(Integer heightCm) {
        this.heightCm = heightCm;
    }

    public void setWeightKg(Integer weightKg) {
        this.weightKg = weightKg;
    }
}
